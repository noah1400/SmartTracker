
from app.db.models import User, Project, TimeEntry

# logging
import logging

def resolve_users(obj, info):
    try:
        users = [user.to_dict(include_time_entries=True) for user in User.query.all()]
        return users
    except Exception as e:
        raise e

def resolve_user(obj, info, id):
    try:
        user = User.query.get(id)
        return user.to_dict()
    except Exception as e:
        raise e

def resolve_projects(obj, info):
    try:
        projects = [prj.to_dict() for prj in Project.query.all()]
        return projects
    except Exception as e:
        raise e

def resolve_project(obj, info, id):
    try:
        project = Project.query.get(id)
        return project.to_dict()
    except Exception as e:
        raise e

def resolve_time_entries(obj, info):
    try:
        time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.all()]
        return time_entries
    except Exception as e:
        raise e

def resolve_time_entry(obj, info, id):
    try:
        time_entry = TimeEntry.query.get(id)
        return time_entry.to_dict()
    except Exception as e:
        raise e
    
def resolve_time_entries_for_user(user: dict, info):
    try:
        time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(user_id=user['id']).all()]
        return time_entries
    except Exception as e:
        raise e
    
def resolve_time_entries_for_project(project: dict, info):
    try:
        time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(project_id=project['id']).all()]
        return time_entries
    except Exception as e:
        raise e
    
def resolve_user_for_time_entry(time_entry: dict, info):
    try:
        user = User.query.get(time_entry['userId'])
        return user.to_dict()
    except Exception as e:
        raise e
    
def resolve_project_for_time_entry(time_entry: dict, info):
    try:
        project = Project.query.get(time_entry['projectId'])
        return project.to_dict()
    except Exception as e:
        raise e