
from app.db.models import User, Project, TimeEntry
from app.auth.auth import auth

# logging
import logging

def resolve_users(obj, info):
    try:
        if auth.user.has_permission('read:users'):
            users = [user.to_dict() for user in User.query.all()]
            return users
        elif auth.user.has_permission('read:own_user'):
            user = User.query.get(auth.user.id)
            return [user.to_dict()]
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e

def resolve_user(obj, info, id):
    try:
        if auth.user.has_permission('read:users'):
            user = User.query.get(id)
            return user.to_dict()
        elif auth.user.has_permission('read:own_user') and auth.user.id == id:
            user = User.query.get(id)
            return user.to_dict()
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e

def resolve_projects(obj, info):
    try:
        if auth.user.has_permission('read:projects'):
            projects = [prj.to_dict() for prj in Project.query.all()]
            return projects
        elif auth.user.has_permission('read:own_projects'):
            projects = [prj.to_dict() for prj in Project.query.filter_by(user_id=auth.user.id).all()]
            return projects
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e

def resolve_project(obj, info, id):
    try:
        if auth.user.has_permission('read:projects'):
            project = Project.query.get(id)
            return project.to_dict()
        elif auth.user.has_permission('read:own_projects'):
            project = Project.query.get(id)
            if project.user_id == auth.user.id:
                return project.to_dict()
            else:
                raise Exception('Unauthorized')
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e

def resolve_time_entries(obj, info):
    try:
        if auth.user.has_permission('read:time_entries'):
            time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.all()]
            return time_entries
        elif auth.user.has_permission('read:own_time_entries'):
            time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(user_id=auth.user.id).all()]
            return time_entries
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e

def resolve_time_entry(obj, info, id):
    try:
        if auth.user.has_permission('read:time_entries'):
            time_entry = TimeEntry.query.get(id)
            return time_entry.to_dict()
        elif auth.user.has_permission('read:own_time_entries'):
            time_entry = TimeEntry.query.get(id)
            if time_entry.user_id == auth.user.id:
                return time_entry.to_dict()
            else:
                raise Exception('Unauthorized')
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_time_entries_for_user(user: dict, info):
    try:
        if auth.user.has_permission('read:time_entries'):
            time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(user_id=user['id']).all()]
            return time_entries
        elif auth.user.has_permission('read:own_time_entries') and auth.user.id == user['id']:
            time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(user_id=user['id']).all()]
            return time_entries
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_time_entries_for_project(project: dict, info):
    try:
        if auth.user.has_permission('read:time_entries'):
            time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(project_id=project['id']).all()]
            return time_entries
        elif auth.user.has_permission('read:own_time_entries') and auth.user.id == project['user_id']:
            time_entries = [time_entry.to_dict() for time_entry in TimeEntry.query.filter_by(project_id=project['id']).all()]
            return time_entries
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_user_for_time_entry(time_entry: dict, info):
    try:
        if auth.user.has_permission('read:users'):
            user = User.query.get(time_entry['userId'])
            return user.to_dict()
        elif auth.user.has_permission('read:own_user') and auth.user.id == time_entry['userId']:
            user = User.query.get(time_entry['userId'])
            return user.to_dict()
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_project_for_time_entry(time_entry: dict, info):
    try:
        if auth.user.has_permission('read:projects'):
            project = Project.query.get(time_entry['projectId'])
            return project.to_dict()
        elif auth.user.has_permission('read:own_projects') and auth.user.id == project['user_id']:
            project = Project.query.get(time_entry['projectId'])
            return project.to_dict()
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e