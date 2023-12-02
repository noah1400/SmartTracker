from app.auth.auth import auth

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