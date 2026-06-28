from functools import lru_cache
from os import getenv


class Settings:
    app_name = "investmate-api"
    version = "v0.1"
    cors_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    database_url = getenv("DATABASE_URL", "")
    tushare_token = getenv("TUSHARE_TOKEN", "")
    openai_api_key = getenv("OPENAI_API_KEY", "")
    openai_model = getenv("OPENAI_MODEL", "gpt-4o-mini")


@lru_cache
def get_settings() -> Settings:
    return Settings()
