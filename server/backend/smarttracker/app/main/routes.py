from datetime import datetime
from app.main import bp
from flask import jsonify, request
from app.auth.auth import auth
from app.db.models.Project import Project
from app.db.models.TimeEntry import TimeEntry
from app.db import db
import logging

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

    response_data = {
        'projects': [],
        'timeEntries': []
    }

    for client_project in client_projects:
        server_project_id = client_project.get('serverID')
        project = Project.query.filter_by(id=server_project_id).first() if server_project_id else None

        if not project:
            project = create_new_project(client_project)
            # Include newly created serverID in the response
            response_data['projects'].append({
                'localID': client_project['localID'],
                'serverID': project.id
            })
        else:
            update_project(project, client_project)

        client_time_entries = client_data['timeEntries']
        for client_entry in client_time_entries:
            time_entry = match_or_create_time_entry(project, client_entry)
            if not client_entry.get('serverID'):
                # Include newly created serverID for time entries in the response
                response_data['timeEntries'].append({
                    'localID': client_entry['localID'],
                    'serverID': time_entry.id
                })

    db.session.commit()
    return jsonify({"status": "success", "data": response_data})

def create_new_project(project_data):
    new_project = Project(name=project_data['name'], description=project_data['description'])
    db.session.add(new_project)
    db.session.commit()
    return new_project

def update_project(existing_project, project_data):
    existing_project.name = project_data['name']
    existing_project.description = project_data['description']
    db.session.commit()

def convert_iso_to_mysql_format(iso_string):
    dt = datetime.fromisoformat(iso_string.replace('Z', '+00:00'))
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def match_or_create_time_entry(project, time_entry_data):
    server_time_entry_id = time_entry_data.get('serverID')
    existing_time_entry = TimeEntry.query.filter_by(id=server_time_entry_id).first() if server_time_entry_id else None

    st = convert_iso_to_mysql_format(time_entry_data['startTime'])
    et = convert_iso_to_mysql_format(time_entry_data['endTime'])

    if not existing_time_entry:
        new_time_entry = TimeEntry(
            project_id=project.id,
            start_time=st,
            end_time=et,
            description=time_entry_data['description']
        )
        db.session.add(new_time_entry)
        return new_time_entry
    else:
        existing_time_entry.start_time = st
        existing_time_entry.end_time = et
        existing_time_entry.description = time_entry_data['description']
        return existing_time_entry
    

@bp.route('/fetch-updates', methods=['GET'])
@auth.auth_authenticated
def fetch_updates(username):
    last_merged = request.args.get('last-merged')

    logging.error(f'last_merged: {last_merged}')

    # last merged format: 1970-01-01T00:00:00.000Z
    last_merged = datetime.strptime(last_merged, '%Y-%m-%dT%H:%M:%S.%fZ')

    # fetch updated projects 
    updated_projects = Project.query.filter(Project.updated_at > last_merged).all()
    # fetch updated time entries of current user ( auth.user.id )
    updated_time_entries = TimeEntry.query.filter(
        TimeEntry.updated_at > last_merged,
        TimeEntry.user_id == auth.user.id
    ).all()

    # Convert data to JSON-friendly format
    projects_data = [project.to_dict() for project in updated_projects]
    time_entries_data = [entry.to_dict() for entry in updated_time_entries]

    return jsonify({
        "projects": projects_data,
        "timeEntries": time_entries_data
    })