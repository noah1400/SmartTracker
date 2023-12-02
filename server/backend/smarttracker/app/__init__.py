from flask import Flask
from flask_cors import CORS
from config import Config
from sqlalchemy import MetaData
from app.db import db

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    
    from app.db.models.User import User
    from app.db.models.Project import Project
    from app.db.models.TimeEntry import TimeEntry
    from app.db.models.Role import Role
    from app.db.models.Permission import Permission

    from app.db.seeders import create_fake_data

    create_fake_data(app)

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.auth import bp_auth
    app.register_blueprint(bp_auth)

    from app.graphql import bp_graphql
    app.register_blueprint(bp_graphql)

    
    @app.route('/test')
    def test():
        return 'Test'
    
    return app