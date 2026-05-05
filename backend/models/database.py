from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize SQLAlchemy library
db = SQLAlchemy()

# PROMPT LIBRARY

class PromptLibrary(db.Model):
    __tablename__ = "prompt_library"

    id = db.Column(db.BigInteger, primary_key=True)

    title = db.Column(
        db.String(255),
        nullable=False,
        index=True
    )

    system_prompt = db.Column(db.Text, nullable=True)

    user_prompt = db.Column(
        db.Text,
        nullable=False
    )

    technique = db.Column(
        db.String(100),
        nullable=False,
        default="zero-shot",
        index=True
    )

    provider = db.Column(
        db.String(50),
        nullable=False,
        default="gemini",
        index=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # Relationships
    versions = db.relationship(
        "PromptVersions",
        backref="prompt",
        lazy=True,
        cascade="all, delete-orphan"
    )

    history = db.relationship(
        "PromptHistory",
        backref="prompt",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "system_prompt": self.system_prompt,
            "user_prompt": self.user_prompt,
            "technique": self.technique,
            "provider": self.provider,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


# PROMPT VERSIONS

class PromptVersions(db.Model):
    __tablename__ = "prompt_versions"

    id = db.Column(db.BigInteger, primary_key=True)

    prompt_id = db.Column(
        db.BigInteger,
        db.ForeignKey("prompt_library.id"),
        nullable=False,
        index=True
    )

    version_number = db.Column(
        db.Integer,
        nullable=False
    )

    system_prompt = db.Column(db.Text, nullable=True)

    user_prompt = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "prompt_id": self.prompt_id,
            "version_number": self.version_number,
            "system_prompt": self.system_prompt,
            "user_prompt": self.user_prompt,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# PROMPT HISTORY
class PromptHistory(db.Model):
    __tablename__ = "prompt_history"

    id = db.Column(db.BigInteger, primary_key=True)

    prompt_id = db.Column(
        db.BigInteger,
        db.ForeignKey("prompt_library.id"),
        nullable=True,
        index=True
    )

    provider = db.Column(
        db.String(50),
        nullable=False,
        index=True
    )

    response = db.Column(
        db.Text,
        nullable=False
    )

    tokens_input = db.Column(db.Integer, nullable=True)
    tokens_output = db.Column(db.Integer, nullable=True)

    latency = db.Column(db.Float, nullable=True)

    temperature = db.Column(db.Float, nullable=True)

    top_p = db.Column(db.Float, nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "prompt_id": self.prompt_id,
            "provider": self.provider,
            "response": self.response,
            "tokens_input": self.tokens_input,
            "tokens_output": self.tokens_output,
            "latency": self.latency,
            "temperature": self.temperature,
            "top_p": self.top_p,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# TEMPLATE LIBRARY
class TemplateLibrary(db.Model):
    __tablename__ = "template_library"

    id = db.Column(db.BigInteger, primary_key=True)

    category = db.Column(
        db.String(100),
        nullable=False,
        index=True
    )

    title = db.Column(
        db.String(255),
        nullable=False,
        index=True
    )

    description = db.Column(db.Text, nullable=True)

    system_prompt = db.Column(db.Text, nullable=True)

    user_prompt = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "title": self.title,
            "description": self.description,
            "system_prompt": self.system_prompt,
            "user_prompt": self.user_prompt,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }