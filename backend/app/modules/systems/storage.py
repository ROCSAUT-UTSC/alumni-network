import logging
from typing import Dict, Tuple

import boto3
from botocore.client import Config as BotoConfig

from app.modules.systems.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

R2_ENDPOINT_URL = f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

session = boto3.session.Session()
s3 = session.client(
    "s3",
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    config=BotoConfig(signature_version="s3v4"),
)


def build_public_url(key: str) -> str:
    base = settings.R2_PUBLIC_BASE_URL.rstrip("/")
    return f"{base}/{key.lstrip('/')}"


def create_presigned_put_url(
    *, key: str, content_type: str, expires_in: int = 600
) -> Tuple[str, int, Dict[str, str]]:
    """
    Create a presigned URL for uploading an avatar via HTTP PUT.

    Returns (upload_url, expires_in, headers).
    """
    url = s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": settings.R2_BUCKET_NAME,
            "Key": key,
            "ContentType": content_type,
        },
        ExpiresIn=expires_in,
    )

    headers = {"Content-Type": content_type}
    return url, expires_in, headers


def delete_object_by_key(key: str) -> None:
    try:
        s3.delete_object(Bucket=settings.R2_BUCKET_NAME, Key=key)
    except Exception:
        logger.warning("Failed to delete object from R2: %s", key, exc_info=True)


def delete_object_by_url(url: str) -> None:
    """
    Best-effort delete: derive key from public URL and delete it.
    """
    if not url:
        return

    base = (settings.R2_PUBLIC_BASE_URL or "").rstrip("/")
    if not url.startswith(base):
        return

    key = url[len(base):].lstrip("/")
    delete_object_by_key(key)
