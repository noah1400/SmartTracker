from datetime import datetime
from app.main import bp
from flask import jsonify, request
from app.auth.auth import auth
from app.db.models.Project import Project
from app.db.models.TimeEntry import TimeEntry
from app.db.models.User import User
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
def merge(username):
    data = request.json
    updated_projects = []
    updated_project_id_map = {}
    updated_time_entries = []

    # Merge projects
    for project_data in data["projects"]:
        if project_data.get("serverID"):  # Existing project
            project = Project.query.get(project_data["serverID"])
            if project:
                project.name = project_data["name"]
                project.description = project_data["description"]
        else:  # New project
            project = Project(project_data["name"], project_data["description"])
            db.session.add(project)

        db.session.commit()
        project_data["serverID"] = project.id
        updated_projects.append(project_data)
        updated_project_id_map[project_data["localID"]] = project.id

    # Merge time entries
    for entry_data in data["timeEntries"]:
        # Update serverProjectID based on the mapping
        if entry_data.get("projectID") in updated_project_id_map:
            entry_data["serverProjectID"] = updated_project_id_map[entry_data["projectID"]]

        if entry_data.get("serverID"):
            entry = TimeEntry.query.get(entry_data["serverID"])
            if entry:
                entry.start_time = datetime.strptime( entry_data["startTime"], '%Y-%m-%dT%H:%M:%S.%fZ')
                entry.end_time = datetime.strptime( entry_data["endTime"], '%Y-%m-%dT%H:%M:%S.%fZ')
                entry.description = entry_data.get("description")
        else:
            # create new TimeEntry
            user = User.query.get(auth.user.id)
            project = Project.query.get(entry_data["serverProjectID"])
            start = datetime.strptime( entry_data["startTime"], '%Y-%m-%dT%H:%M:%S.%fZ')
            end = datetime.strptime( entry_data["endTime"], '%Y-%m-%dT%H:%M:%S.%fZ')
            description = entry_data.get("description")
            entry = TimeEntry(user, project, start, end, description)
            db.session.add(entry)

        db.session.commit()
        entry_data["serverID"] = entry.id
        updated_time_entries.append(entry_data)

    return jsonify({"status": "success", "projects": updated_projects, "timeEntries": updated_time_entries})

    

@bp.route('/fetch-updates', methods=['GET'])
@auth.auth_authenticated
def fetch_updates(username):
    last_merged = request.args.get('last-merged')

    logging.error(f'last_merged: {last_merged}')

    # last merged format: 1970-01-01T00:00:00.000Z
    last_merged = datetime.strptime(last_merged, '%Y-%m-%dT%H:%M:%S.%fZ')

    # fetch updated projects 
    updated_project_id_map = Project.query.filter(Project.updated_at > last_merged).all()
    # fetch updated time entries of current user ( auth.user.id )
    updated_time_entries = TimeEntry.query.filter(
        TimeEntry.updated_at > last_merged,
        TimeEntry.user_id == auth.user.id
    ).all()

    logging.error(updated_time_entries)

    # Convert data to JSON-friendly format
    projects_data = [{
        "serverID": p.id,
        "name": p.name,
        "description": p.description,
    } for p in updated_project_id_map]
    time_entries_data = [{
        "serverID": entry.id,
        "description": entry.description,
        "startTime": entry.start_time.isoformat(),
        "endTime": entry.end_time.isoformat(),
        "userId": entry.user_id,
        "serverProjectID": entry.project_id,
    } for entry in updated_time_entries]

    dic = {
        "projects": projects_data,
        "timeEntries": time_entries_data
    }

    ret = jsonify(dic)

    logging.error(f"Fetch updates will return: {dic}")

    return ret