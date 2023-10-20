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

    from app.models import User, Project, TimeEntry
    with app.app_context():
        print('Dropping database tables...')
        db.drop_all()
        print('Creating database tables...')
        db.create_all()
        user = User(username='admin', email="admin@example.com", service="internal", password="admin")
        try:
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            print("Error adding user: ", e)
            db.session.rollback()
            pass 
        users = User.query.all()
        print('Users: ', [usr.to_dict() for usr in users])

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