import resend
from typing import Iterable, Union, Optional

from app.modules.systems.config import get_settings

settings = get_settings()

def send_email(*, to: Union[str, Iterable[str]], subject: str, html: str, text: Optional[str] = None) -> dict:
    settings = get_settings()
    resend.api_key = settings.RESEND_API_KEY

    to_list = [to] if isinstance(to, str) else list(to)

    params: resend.Emails.SendParams = {
        "from": settings.EMAIL_FROM,   
        "to": to_list,
        "subject": subject,
        "html": html,
    }
    if text is not None:
        params["text"] = text

    return resend.Emails.send(params)


def send_verification_email(*, to_email: str, token: str) -> dict:
    settings = get_settings()
    verify_url = f"{settings.FRONTEND_URL}/verify?token={token}"

    html = f"""
      <p>Verify your email by clicking the link below:</p>
      <p><a href="{verify_url}">Verify email</a></p>
      <p>This link expires soon. If you didn’t request this, ignore this email.</p>
    """
    return send_email(to=to_email, subject="Verify your email", html=html)