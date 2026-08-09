import structlog

logger = structlog.get_logger()


class EmailProvider:
    """
    Abstraction layer for Email delivery (SendGrid / AWS SES).
    """

    @staticmethod
    async def send_email(to_email: str, subject: str, body: str) -> dict:
        """
        Mocks sending an email via SendGrid.
        """
        logger.info("email_sent_mock", to=to_email, subject=subject)
        import uuid

        return {"status": "sent", "provider_id": f"sg_{uuid.uuid4().hex}"}
