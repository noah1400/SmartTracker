from app.main import bp
from flask import jsonify, request
from app.auth.auth import auth
from app.db.models import Project, TimeEntry
from app.db import db


@bp.route('/ping', methods=['GET'])
def ping():
    return jsonify('pong')

@bp.route('/protected-ping', methods=['GET'])
@auth.auth_authenticated
def protected_ping(username):
    return jsonify('protected pong')

@bp.route('/merge', methods=['POST'])
@auth.auth_authenticated
def merge_data(username):
    client_data = request.json
    client_projects = client_data['projects']

    for client_project in client_projects:
        # Identify or create the project
        project = Project.query.filter_by(name=client_project['name']).first()
        if not project:
            project = create_new_project(client_project)
        else:
            update_project(project, client_project)

        # Synchronize time entries for this project
        client_time_entries = client_project['timeEntries']
        for client_entry in client_time_entries:
            # Logic to match time entries to this project, update or create as needed
            time_entry = match_or_create_time_entry(project, client_entry)

    db.session.commit()
    return jsonify({"status": "success"})

def create_new_project(project):
    new_project = Project(name=project['name'], description=project['description'])
    db.session.add(new_project)
    db.session.commit()

def update_project(existing_project, project):
    existing_project.name = project['name']
    existing_project.description = project['description']
    db.session.commit()

def match_or_create_time_entry(project, time_entry):
    existing_time_entry = TimeEntry.query.filter_by(project_id=project.id, start_time=time_entry['startTime']).first()
    if not existing_time_entry:
        new_time_entry = TimeEntry(
            project_id=project.id,
            start_time=time_entry['startTime'],
            end_time=time_entry['endTime'],
            description=time_entry['description']
        )
        db.session.add(new_time_entry)
        return new_time_entry
    else:
        existing_time_entry.start_time = time_entry['startTime']
        existing_time_entry.end_time = time_entry['endTime']
        existing_time_entry.description = time_entry['description']
        return existing_time_entry
    

@bp.route('/fetch-updates', methods=['GET'])
@auth.auth_authenticated
def fetch_updates(username):
    last_merged = request.args.get('lastMerged')
    updated_projects = Project.query.filter(Project.updated_at > last_merged).all()
    updated_time_entries = TimeEntry.query.filter(TimeEntry.updated_at > last_merged).all()

    # Convert data to JSON-friendly format
    projects_data = [project.to_dict() for project in updated_projects]
    time_entries_data = [entry.to_dict() for entry in updated_time_entries]

    return jsonify({
        "projects": projects_data,
        "timeEntries": time_entries_data
    })