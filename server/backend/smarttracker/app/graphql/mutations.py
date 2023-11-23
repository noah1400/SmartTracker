from app.auth.auth import auth
from app.db import db
from app.db.models import User, Project, TimeEntry
import logging

def resolve_create_user(obj, info, username, email, password, service, role = 'user'):
    logging.error('resolve_create_user')
    try:
        if auth.user.has_permission('create:users'):
            user = User.create_with_role(username=username, email=email, password=password, service=service, role=role)
            logging.error(user)
            logging.error(user.to_dict())
            return user.to_dict()
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_update_user(obj, info, id, username, email, service, role):
    try:
        if auth.user.has_permission('update:users'):
            user = User.query.get(id)
            if user:
                user.username = username if username else user.username               
                user.email = email if email else user.email
                user.service = service if service else user.service
                user.role = role if role else user.role
                db.session.commit()
                return [user.id]
            else:
                raise Exception('User not found')
        elif auth.user.has_permission('update:own_user'):
            user = User.query.get(id)
            if user:
                if user.id == auth.user.id:
                    user.username = username if username else user.username
                    user.email = email if email else user.email
                    user.service = service if service else user.service
                    user.role = role if role else user.role
                    db.session.commit()
                    return [user.id]
                else:
                    raise Exception('Unauthorized')
            else:
                raise Exception('User not found')
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_delete_user(obj, info, id):
    try:
        if auth.user.has_permission('delete:users'):
            user = User.query.get(id)
            if user:
                db.session.delete(user)
                db.session.commit()
                return 1
            else:
                raise Exception('User not found')
        elif auth.user.has_permission('delete:own_user'):
            user = User.query.get(id)
            if user:
                if user.id == auth.user.id:
                    db.session.delete(user)
                    db.session.commit()
                    return 1
                else:
                    raise Exception('Unauthorized')
            else:
                raise Exception('User not found')
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_create_project(obj, info, name, description):
    try:
        if auth.user.has_permission('create:projects'):
            project = Project(name=name, description=description)
            db.session.add(project)
            db.session.commit()
            return project.to_dict()
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_update_project(obj, info, id, name, description):
    try:
        if auth.user.has_permission('update:projects'):
            project = Project.query.get(id)
            if project:
                project.name = name if name else project.name
                project.description = description if description else project.description
                db.session.commit()
                return [project.id]
            else:
                raise Exception('Project not found')
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_delete_project(obj, info, id):
    try:
        if auth.user.has_permission('delete:projects'):
            project = Project.query.get(id)
            if project:
                db.session.delete(project)
                db.session.commit()
                return 1
            else:
                raise Exception('Project not found')
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_create_time_entry(obj, info, description, startTime, endTime, userId, projectId):
    try:
        if auth.user.has_permission('create:time_entries'):
            time_entry = TimeEntry(description=description, startTime=startTime, endTime=endTime, userId=userId, projectId=projectId)
            db.session.add(time_entry)
            db.session.commit()
            return time_entry.to_dict()
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_update_time_entry(obj, info, id, description, startTime, endTime, userId, projectId):
    try:
        if auth.user.has_permission('update:time_entries'):
            time_entry = TimeEntry.query.get(id)
            if time_entry:
                time_entry.description = description if description else time_entry.description
                time_entry.startTime = startTime if startTime else time_entry.startTime
                time_entry.endTime = endTime if endTime else time_entry.endTime
                time_entry.userId = userId if userId else time_entry.userId
                time_entry.projectId = projectId if projectId else time_entry.projectId
                db.session.commit()
                return [time_entry.id]
            else:
                raise Exception('Time entry not found')
        elif auth.user.has_permission('update:own_time_entries'):
            time_entry = TimeEntry.query.get(id)
            if time_entry:
                if time_entry.userId == auth.user.id:
                    time_entry.description = description if description else time_entry.description
                    time_entry.startTime = startTime if startTime else time_entry.startTime
                    time_entry.endTime = endTime if endTime else time_entry.endTime
                    time_entry.userId = userId if userId else time_entry.userId
                    time_entry.projectId = projectId if projectId else time_entry.projectId
                    db.session.commit()
                    return [time_entry.id]
                else:
                    raise Exception('Unauthorized')
            else:
                raise Exception('Time entry not found')
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e
    
def resolve_delete_time_entry(obj, info, id):
    try:
        if auth.user.has_permission('delete:time_entries'):
            time_entry = TimeEntry.query.get(id)
            if time_entry:
                db.session.delete(time_entry)
                db.session.commit()
                return 1
            else:
                raise Exception('Time entry not found')
        elif auth.user.has_permission('delete:own_time_entries'):
            time_entry = TimeEntry.query.get(id)
            if time_entry:
                if time_entry.userId == auth.user.id:
                    db.session.delete(time_entry)
                    db.session.commit()
                    return 1
                else:
                    raise Exception('Unauthorized')
            else:
                raise Exception('Time entry not found')
        else:
            raise Exception('Unauthorized')
    except Exception as e:
        raise e