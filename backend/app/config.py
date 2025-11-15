from pydantic_settings import BaseSettings
from pydantic import Field, ConfigDict


class Settings(BaseSettings):
    # ✅ MongoDB Atlas connection (fallback to localhost)
    MONGO_URI: str = Field(
        "mongodb://localhost:27017/financial", env="MONGO_URI"
    )
    MONGO_DB_NAME: str = Field("financial", env="MONGO_DB_NAME")

    # ✅ Redis (optional — safe default for local testing)
    REDIS_URL: str = Field("redis://localhost:6379/0", env="REDIS_URL")

    # ✅ APIs and general app settings
    NEWS_API_KEY: str = Field("", env="NEWS_API_KEY")
    YFINANCE_ENABLED: bool = Field(True, env="YFINANCE_ENABLED")
    APP_NAME: str = "Financial Research Agent"
    ENV: str = Field("dev", env="ENV")

    # Optional LangChain tracing settings (for debugging/monitoring)
    langchain_tracing_v2: str = Field(default="", env="LANGCHAIN_TRACING_V2")
    langchain_api_key: str = Field(default="", env="LANGCHAIN_API_KEY")
    langchain_project: str = Field(default="", env="LANGCHAIN_PROJECT")

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # Ignore extra fields in .env that aren't defined here
    )


# ✅ Instantiate global settings
settings = Settings()
