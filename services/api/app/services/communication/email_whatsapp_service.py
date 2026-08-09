import os
import httpx
import uuid
from typing import Dict, Any, List
from fastapi import HTTPException

class EmailWhatsAppService:
    def __init__(self):
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY", "mock_sendgrid")
        self.meta_wa_token = os.getenv("META_WA_TOKEN", "mock_meta")
        self.meta_phone_id = os.getenv("META_PHONE_ID", "mock_phone")

    async def send_email(self, to_email: str, subject: str, body: str, attachments: List[str] = []) -> Dict[str, Any]:
        """Send an email using SendGrid API"""
        if self.sendgrid_api_key == "mock_sendgrid":
            return {"status": "sent", "provider_id": f"SG.{uuid.uuid4().hex}"}

        url = "https://api.sendgrid.com/v3/mail/send"
        headers = {
            "Authorization": f"Bearer {self.sendgrid_api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "personalizations": [{"to": [{"email": to_email}]}],
            "from": {"email": "hello@salespilot.ai", "name": "SalesPilot AI"},
            "subject": subject,
            "content": [{"type": "text/html", "value": body}]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            if response.status_code not in (200, 202):
                raise HTTPException(status_code=500, detail="Failed to send Email via SendGrid")
            return {"status": "sent", "provider_id": response.headers.get("x-message-id", "unknown")}

    async def send_whatsapp(self, to_number: str, message: str) -> Dict[str, Any]:
        """Send a WhatsApp message via Meta Cloud API"""
        if self.meta_wa_token == "mock_meta":
            return {"status": "sent", "provider_id": f"WAM.{uuid.uuid4().hex}"}

        url = f"https://graph.facebook.com/v17.0/{self.meta_phone_id}/messages"
        headers = {
            "Authorization": f"Bearer {self.meta_wa_token}",
            "Content-Type": "application/json"
        }
        data = {
            "messaging_product": "whatsapp",
            "to": to_number,
            "type": "text",
            "text": {"body": message}
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            if response.status_code not in (200, 201):
                raise HTTPException(status_code=500, detail="Failed to send WhatsApp message")
            return {"status": "sent", "provider_id": response.json().get("messages", [{}])[0].get("id", "unknown")}

email_wa_service = EmailWhatsAppService()
