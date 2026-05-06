import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


class Config:
    """Base configuration shared across all environments."""

    # Core Flask Config
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
    DEBUG = False
    TESTING = False

    # Database Configuration
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///prompt_playground.db")
    
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgres://",
            "postgresql://",
            1
        )

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # API Provider Keys
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

    # Default LLM Provider
    DEFAULT_PROVIDER = os.getenv("DEFAULT_PROVIDER", "gemini")

    # Security / Rate Limit
    RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", 30))

    # Frontend / CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

    # Token Limits
    DEFAULT_MAX_TOKENS = int(os.getenv("DEFAULT_MAX_TOKENS", 1024))

    # Request Timeout
    REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", 60))


class DevelopmentConfig(Config):
    """Development environment config."""
    DEBUG = True


class ProductionConfig(Config):
    """Production environment config."""
    DEBUG = False


class TestingConfig(Config):
    """Testing environment config."""
    TESTING = True
    DEBUG = True


# Config switcher
config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig
}

# Active config
current_config = config_by_name.get(
    os.getenv("FLASK_ENV", "production").lower(),
    ProductionConfig
)