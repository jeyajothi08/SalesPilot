import structlog

logger = structlog.get_logger()


class WhatsAppProvider:
    """
    Abstraction layer for Meta WhatsApp Business API.
    """

    @staticmethod
    async def send_message(to_phone: str, text: str) -> dict:
        """
        Mocks sending a WhatsApp message.
        """
        logger.info("whatsapp_sent_mock", to=to_phone, length=len(text))
        import uuid

        return {"status": "delivered", "provider_id": f"wa_{uuid.uuid4().hex}"}
