import resend
from app.core.config import get_settings

settings = get_settings()

resend.api_key = settings.RESEND_API_KEY

def send_email(to: str, subject: str, html: str):
    return resend.Emails.send({
        "from": settings.EMAIL_FROM,
        "to": [to],
        "subject": subject,
        "html": html,
    })
