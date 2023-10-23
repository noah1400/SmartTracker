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
    
    def to_dict(self, include_time_entries=False):
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'service': self.service,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
        }
        return data
    
class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64), index=True, unique=True)
    description = db.Column(db.String(256), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now(), nullable=False)
    
    time_entries = db.relationship('TimeEntry', back_populates='project')
    
    def __init__(self, name, description):
        self.name = name
        self.description = description
    
    def __repr__(self):
        return '<Project {}>'.format(self.name)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }
    
class TimeEntry(db.Model):
    __tablename__ = 'time_entries'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    start_time = db.Column(db.DateTime, server_default=db.func.now())
    end_time = db.Column(db.DateTime)
    description = db.Column(db.String(256))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    
    user = db.relationship('User', back_populates='time_entries')
    project = db.relationship('Project', back_populates='time_entries')
    
    def __init__(self, user, project, start, end, description=None):
        self.user = user
        self.project = project
        self.start_time = start
        self.end_time = end
        self.description = description
    
    def __repr__(self):
        return '<TimeEntry {}>'.format(self.id)
    
    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'startTime': self.start_time.isoformat(),
            'endTime': self.end_time.isoformat(),
            'userId': self.user_id,
            'projectId': self.project_id, 
            'createdAt': self.created_at.isoformat(),  
            'updatedAt': self.updated_at.isoformat() 
        }