from flask import Flask, jsonify
from flask_cors import CORS

# Config
from config import current_config
# Database
from models.database import db
# Route Blueprints
from routes.generate import generate_bp
from routes.prompts import prompts_bp
from routes.templates import templates_bp
from routes.history import history_bp
from routes.compare import compare_bp
from routes.sweep import sweep_bp
from routes.export_import import export_import_bp


def create_app():
    """Application factory pattern."""

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(current_config)

    # Enable CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}}
    )

    # Initialize database
    db.init_app(app)

    # Create tables automatically (good for assignment/dev)
    with app.app_context():
        db.create_all()

    @app.route("/", methods=["GET"])
    def home():
        return {
            "status": "success",
            "message": "Prompt Engineering Playground Backend Running"
        }

    # Health Check Route
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "success",
            "message": "Prompt Engineering Playground API is running",
            "environment": "development" if app.config["DEBUG"] else "production"
        }), 200

    # Register Blueprints
    app.register_blueprint(generate_bp, url_prefix="/api")
    app.register_blueprint(prompts_bp, url_prefix="/api")
    app.register_blueprint(templates_bp, url_prefix="/api")
    app.register_blueprint(history_bp, url_prefix="/api")
    app.register_blueprint(compare_bp, url_prefix="/api")
    app.register_blueprint(sweep_bp, url_prefix="/api")
    app.register_blueprint(export_import_bp, url_prefix="/api")

   
    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "status": "error",
            "message": "Endpoint not found"
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "status": "error",
            "message": "Internal server error"
        }), 500

    return app



# Run Server
if __name__ == "__main__":
    app = create_app()
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=current_config.DEBUG
    )