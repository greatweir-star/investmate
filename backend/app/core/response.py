from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Optional
from uuid import uuid4

from app.core.config import get_settings


CN_TZ = timezone(timedelta(hours=8))


def now_iso() -> str:
    return datetime.now(CN_TZ).isoformat(timespec="seconds")


def today_text() -> str:
    return datetime.now(CN_TZ).date().isoformat()


def success_response(data, data_date: Optional[str] = None):
    settings = get_settings()
    return {
        "success": True,
        "data": data,
        "error": None,
        "meta": {
            "request_id": f"req_{uuid4().hex[:12]}",
            "generated_at": now_iso(),
            "data_date": data_date or today_text(),
            "version": settings.version,
        },
    }


def error_response(code: str, message: str, status_code: int = 400):
    settings = get_settings()
    return {
        "success": False,
        "data": None,
        "error": {
            "code": code,
            "message": message,
        },
        "meta": {
            "request_id": f"req_{uuid4().hex[:12]}",
            "generated_at": now_iso(),
            "version": settings.version,
        },
    }, status_code
