from app.db import db
import bcrypt

class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True)
    password_hash = db.Column(db.String(256))
    service = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    time_entries = db.relationship('TimeEntry', back_populates='user')

    def __init__(self, username, email, password, service):
        self.username = username
        self.email = email
        self.set_password(password)
        self.service = service

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64), index=True, unique=True)
    description = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    
    time_entries = db.relationship('TimeEntry', back_populates='project')
    
    def __init__(self, name, description):
        self.name = name
        self.description = description
    
    def __repr__(self):
        return '<Project {}>'.format(self.name)
    
class TimeEntry(db.Model):
    __tablename__ = 'time_entries'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    start_time = db.Column(db.DateTime, server_default=db.func.now())
    end_time = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    
    user = db.relationship('User', back_populates='time_entries')
    project = db.relationship('Project', back_populates='time_entries')
    
    def __init__(self, user, project):
        self.user = user
        self.project = project
    
    def __repr__(self):
        return '<TimeEntry {}>'.format(self.id)