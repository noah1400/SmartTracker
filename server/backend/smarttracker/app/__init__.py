from flask import Flask
from config import Config
from app.db import DB

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    db = DB().instance

    # Initialize extensions
    db.init_app(app)

    from app.models import User
    with app.app_context():
        print('Creating database tables...')
        db.create_all()

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.auth import bp_auth
    app.register_blueprint(bp_auth)

    
    @app.route('/test')
    def test():
        return 'Test'
    
    return app