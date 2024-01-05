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
    updated_projects, updated_project_id_map = merge_projects(data["projects"])
    updated_time_entries = merge_time_entries(data["timeEntries"], updated_project_id_map)

    return jsonify({"status": "success", "projects": updated_projects, "timeEntries": updated_time_entries})

def merge_projects(project_data_list):
    updated_projects = []
    updated_project_id_map = {}

    for project_data in project_data_list:
        project = update_or_create_project(project_data)
        project_data["serverID"] = project.id
        updated_projects.append(project_data)
        updated_project_id_map[project_data.get("localID")] = project.id

    return updated_projects, updated_project_id_map

def update_or_create_project(project_data):
    if project_data.get("serverID"):  # Existing project
        project = Project.query.get(project_data["serverID"])
        if project:
            project.name = project_data["name"]
            project.description = project_data["description"]
    else:  # New project
        project = Project(project_data["name"], project_data["description"])
        db.session.add(project)

    db.session.commit()
    return project

def merge_time_entries(time_entry_data_list, project_id_map):
    updated_time_entries = []

    for entry_data in time_entry_data_list:
        update_project_id_in_entry(entry_data, project_id_map)
        entry = update_or_create_time_entry(entry_data)
        entry_data["serverID"] = entry.id
        updated_time_entries.append(entry_data)

    return updated_time_entries

def update_project_id_in_entry(entry_data, project_id_map):
    if entry_data.get("projectID") in project_id_map:
        entry_data["serverProjectID"] = project_id_map[entry_data["projectID"]]

def update_or_create_time_entry(entry_data):
    if entry_data.get("serverID"):
        entry = TimeEntry.query.get(entry_data["serverID"])
        if entry:
            entry.start_time = parse_datetime(entry_data["startTime"])
            entry.end_time = parse_datetime(entry_data["endTime"])
            entry.description = entry_data.get("description")
    else:
        user = User.query.get(auth.user.id)
        project = Project.query.get(entry_data["serverProjectID"])
        start = parse_datetime(entry_data["startTime"])
        end = parse_datetime(entry_data["endTime"])
        description = entry_data.get("description")
        entry = TimeEntry(user, project, start, end, description)
        db.session.add(entry)

    db.session.commit()
    return entry
    

@bp.route('/fetch-updates', methods=['GET'])
@auth.auth_authenticated
def fetch_updates(username):
    last_merged_str = request.args.get('last-merged')
    last_merged = parse_datetime(last_merged_str)

    updated_projects = fetch_updated_projects(last_merged)
    updated_time_entries = fetch_updated_time_entries(last_merged)

    projects_data = convert_projects_to_json(updated_projects)
    time_entries_data = convert_time_entries_to_json(updated_time_entries)

    return jsonify({"projects": projects_data, "timeEntries": time_entries_data})

def parse_datetime(datetime_str):
    return datetime.strptime(datetime_str, '%Y-%m-%dT%H:%M:%S.%fZ') if datetime_str else None

def fetch_updated_projects(last_merged):
    return Project.query.filter(Project.updated_at > last_merged).all() if last_merged else []

def fetch_updated_time_entries(last_merged):
    return TimeEntry.query.filter(
        TimeEntry.updated_at > last_merged,
        TimeEntry.user_id == auth.user.id
    ).all() if last_merged else []

def convert_projects_to_json(projects):
    return [{
        "serverID": project.id,
        "name": project.name,
        "description": project.description,
    } for project in projects]

def convert_time_entries_to_json(time_entries):
    return [{
        "serverID": entry.id,
        "description": entry.description,
        "startTime": entry.start_time.isoformat(),
        "endTime": entry.end_time.isoformat(),
        "userId": entry.user_id,
        "serverProjectID": entry.project_id,
    } for entry in time_entries]
