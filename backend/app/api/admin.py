from __future__ import annotations

from typing import Optional

from pydantic import BaseModel
from fastapi import APIRouter

from app.core.response import now_iso, success_response, today_text

router = APIRouter()

sync_state = {
    "latest_data_date": today_text(),
    "status": "mock_ready",
    "items": [
        {"data_type": "asset_basic", "row_count": 6, "status": "success"},
        {"data_type": "market_status", "row_count": 1, "status": "success"},
    ],
}


class SyncRequest(BaseModel):
    scope: list[str] = ["asset_basic"]
    trade_date: Optional[str] = None


@router.post("/api/admin/sync")
def trigger_sync(payload: SyncRequest):
    trade_date = payload.trade_date or today_text()
    sync_state["latest_data_date"] = trade_date
    sync_state["status"] = "success"
    sync_state["items"] = [
        {"data_type": item, "row_count": 6 if item == "asset_basic" else 1, "status": "success"}
        for item in payload.scope
    ]
    return success_response(
        {
            "sync_id": f"sync_{trade_date.replace('-', '')}",
            "status": "success",
            "scope": payload.scope,
            "started_at": now_iso(),
            "finished_at": now_iso(),
        },
        trade_date,
    )


@router.get("/api/admin/sync/status")
def sync_status():
    return success_response(sync_state, sync_state["latest_data_date"])
