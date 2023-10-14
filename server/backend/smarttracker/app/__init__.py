from flask import Flask
from config import Config
from app.extensions import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)

    from app.models import User
    db.drop_all()
    db.create_all()

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    
    @app.route('/test')
    def test():
        return 'Test'
    
    return app