from app.auth.auth import auth
from app.auth.exceptions import Unauthorized
from app.graphql.exceptions import NotFound
from app.db import db
from app.db.models.Project import Project

unauthorized = Unauthorized('Unauthorized')
project_not_found = NotFound('Project not found')

### Resolvers ###

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