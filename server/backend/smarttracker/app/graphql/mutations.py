from app.auth.auth import auth
from app.auth.exceptions import Unauthorized
from app.graphql.exceptions import NotFound
from app.db import db
from app.db.models import User, Project, TimeEntry
import logging

user_not_found = NotFound('User not found')
project_not_found = NotFound('Project not found')
time_entry_not_found = NotFound('Time entry not found')
unauthorized = Unauthorized('Unauthorized')

### Helpers ###

def update_user_properties(user, username, email, service, role):
    """Updates the user properties."""
    user.username = username if username else user.username
    user.email = email if email else user.email
    user.service = service if service else user.service
    user.role = role if role else user.role
    db.session.commit()
    return user

def update_time_entry_properties(time_entry, description, start_time, end_time, user_id, project_id):
    """Updates the time entry properties."""
    time_entry.description = description if description else time_entry.description
    time_entry.start_time = start_time if start_time else time_entry.start_time
    time_entry.end_time = end_time if end_time else time_entry.end_time
    time_entry.user_id = user_id if user_id else time_entry.user_id
    time_entry.project_id = project_id if project_id else time_entry.project_id
    db.session.commit()
    return time_entry

def is_authorized_for_action(entity_type, action, entity_id=None):
    """
    Checks if the user is authorized for the given action on the specified entity type.
    
    :param entity_type: Type of entity (e.g., 'user', 'time_entry', 'project', 'role', 'permission').
    :param action: CRUD action (e.g., 'create', 'read', 'update', 'delete').
    :param entity_id: ID of the entity for ownership-based permission checks.
    :return: Boolean indicating authorization status.
    """
    permission_map = {
        'user': {
            'create': 'create:users',
            'read': 'read:users',
            'update': 'update:users',
            'delete': 'delete:users',
            'own_read': 'read:own_user',
            'own_update': 'update:own_user',
            'own_delete': 'delete:own_user'
        },
        'time_entry': {
            'create': 'create:time_entries',
            'read': 'read:time_entries',
            'update': 'update:time_entries',
            'delete': 'delete:time_entries',
            'own_create': 'create:own_time_entries',
            'own_read': 'read:own_time_entries',
            'own_update': 'update:own_time_entries',
            'own_delete': 'delete:own_time_entries'
        },
        'project': {
            'create': 'create:projects',
            'read': 'read:projects',
            'update': 'update:projects',
            'delete': 'delete:projects',
            'own_create': 'create:own_projects',
            'own_read': 'read:own_projects',
            'own_update': 'update:own_projects',
            'own_delete': 'delete:own_projects'
        },
        'role': {
            'create': 'create:roles',
            'read': 'read:roles',
            'update': 'update:roles',
            'delete': 'delete:roles'
        },
        'permission': {
            'create': 'create:permissions',
            'read': 'read:permissions',
            'update': 'update:permissions',
            'delete': 'delete:permissions'
        }
    }

    permissions = permission_map.get(entity_type, {})
    if not permissions:
        return False

    general_permission = permissions.get(action)
    own_permission = permissions.get(f'own_{action}')

    if general_permission and auth.user.has_permission(general_permission):
        return True
    if own_permission and entity_id and auth.user.has_permission(own_permission) and entity_id == auth.user.id:
        return True

    return False



### Resolvers ###

def resolve_create_user(obj, info, username, email, password, service, role = 'user'):
    if auth.user.has_permission('create:users'):
        user = User.create_with_role(username=username, email=email, password=password, service=service, role=role)
        return user.to_dict()
    else:
        raise unauthorized
    
def resolve_update_user(obj, info, id, username, email, service, role):
    user = User.query.get(id)
    if not user:
        raise user_not_found
    if not is_authorized_for_action('user', 'update', user.id):
        raise unauthorized
    user = update_user_properties(user, username, email, service, role)
    return [user.id]

def resolve_delete_user(obj, info, id):
    user = User.query.get(id)
    if not user:
        raise user_not_found
    if not is_authorized_for_action('user', 'delete', user.id):
        raise unauthorized
    db.session.delete(user)
    db.session.commit()
    return 1
    
    
def resolve_create_project(obj, info, name, description):
    if auth.user.has_permission('create:projects'):
        project = Project(name=name, description=description)
        db.session.add(project)
        db.session.commit()
        return project.to_dict()
    else:
        raise unauthorized
    
def resolve_update_project(obj, info, id, name, description):
    if auth.user.has_permission('update:projects'):
        project = Project.query.get(id)
        if project:
            project.name = name if name else project.name
            project.description = description if description else project.description
            db.session.commit()
            return [project.id]
        else:
            raise project_not_found
    else:
        raise unauthorized
    
def resolve_delete_project(obj, info, id):
    if auth.user.has_permission('delete:projects'):
        project = Project.query.get(id)
        if project:
            db.session.delete(project)
            db.session.commit()
            return 1
        else:
            raise project_not_found
    else:
        raise unauthorized
    
def resolve_create_time_entry(obj, info, description, start_time, end_time, user_id, project_id):
    if auth.user.has_permission('create:time_entries'):
        time_entry = TimeEntry(description=description, start_time=start_time, end_time=end_time, user_id=user_id, project_id=project_id)
        db.session.add(time_entry)
        db.session.commit()
        return time_entry.to_dict()
    else:
        raise unauthorized
    
def resolve_update_time_entry(obj, info, id, description, start_time, end_time, user_id, project_id):
    time_entry = TimeEntry.query.get(id)
    if not time_entry:
        raise time_entry_not_found

    is_own_entry = time_entry.user_id == auth.user.id
    if not is_authorized_for_action('time_entry', 'update', time_entry.user_id if is_own_entry else None):
        raise unauthorized

    update_time_entry_properties(time_entry, description, start_time, end_time, user_id, project_id)
    return [time_entry.id]

def resolve_delete_time_entry(obj, info, id):
    time_entry = TimeEntry.query.get(id)
    if not time_entry:
        raise time_entry_not_found
    
    is_own_entry = time_entry.user_id == auth.user.id
    if not is_authorized_for_action('time_entry', 'delete', time_entry.user_id if is_own_entry else None):
        raise unauthorized

    db.session.delete(time_entry)
    db.session.commit()
    return 1

