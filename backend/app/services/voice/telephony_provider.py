class TelephonyProvider:
    """
    Abastraction layer for Telephony operations (e.g., Twilio).
    """

    @staticmethod
    async def initiate_outbound_call(
        to_number: str, from_number: str, webhook_url: str
    ) -> str:
        """
        Mocks a Twilio API call to start an outbound call.
        Returns a mock Call SID.
        """
        # In production:
        # client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        # call = client.calls.create(to=to_number, from_=from_number, url=webhook_url)
        # return call.sid
        import uuid

        return f"CA{uuid.uuid4().hex}"

    @staticmethod
    def generate_twiml_response(text_to_say: str) -> str:
        """
        Generates the raw XML string for Twilio to execute.
        Using <Gather> to listen for customer speech.
        """
        return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Matthew-Neural">{text_to_say}</Say>
    <Gather input="speech" action="/api/v1/voice/webhook/twiml" speechTimeout="auto">
    </Gather>
</Response>"""
