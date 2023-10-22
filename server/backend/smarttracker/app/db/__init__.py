from flask_sqlalchemy import SQLAlchemy

class DB(object):

    def __new__(cls):
        if not hasattr(cls, '_instance') or not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.db = SQLAlchemy()

    @property
    def instance(self):
        return self.db

db = DB().instance