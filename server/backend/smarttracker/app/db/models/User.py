from app.db import db
from app.db.models.Role import Role
import bcrypt

class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True)
    password_hash = db.Column(db.String(256))
    service = db.Column(db.String(64))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    time_entries = db.relationship('TimeEntry', back_populates='user')
    role = db.relationship('Role', back_populates='users')

    @classmethod
    def create_with_role(cls, username, email, password, service, role='user'):
        user = cls(username, email, password, service)
        
        role_obj = Role.query.filter_by(name=role).first()
        if role_obj:
            user.role = role_obj

        db.session.add(user)
        db.session.commit()

        return user

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
    
    def to_dict(self):
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'service': self.service,
            'role': self.role.name if self.role else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
        return data
    
    def has_permission(self, permissions: str | list[str]) -> bool:
        if isinstance(permissions, str):
            permissions = [permissions]
        for permission in permissions:
            if self.role and self.role.permissions:
                if permission in [p.name for p in self.role.permissions]:
                    return True
        return False