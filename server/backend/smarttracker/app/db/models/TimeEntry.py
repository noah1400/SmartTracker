from app.db import db

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