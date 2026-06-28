from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import admin, assets, history, market, portfolio, settings
from app.core.config import get_settings
from app.core.response import error_response, success_response

config = get_settings()

app = FastAPI(
    title="InvestMate API",
    version=config.version,
    description="InvestMate 第一阶段 MVP mock API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    payload, status_code = error_response("REQUEST_ERROR", str(exc.detail), exc.status_code)
    return JSONResponse(status_code=status_code, content=payload)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    payload, status_code = error_response("VALIDATION_ERROR", "输入内容不完整或格式不正确。", 422)
    return JSONResponse(status_code=status_code, content=payload)


@app.get("/health")
def health():
    return success_response(
        {
            "status": "ok",
            "service": config.app_name,
            "version": config.version,
        }
    )


app.include_router(market.router)
app.include_router(assets.router)
app.include_router(portfolio.router)
app.include_router(history.router)
app.include_router(settings.router)
app.include_router(admin.router)
