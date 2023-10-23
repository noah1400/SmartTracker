from app.db.models import User, Project, TimeEntry
from app.db import db
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()

def create_fake_user():
    username = fake.user_name()
    while User.query.filter_by(username=username).first():
        username = fake.user_name()
    user = User(username, fake.email(), fake.password(), 'internal')
    return user

def create_fake_project():
    project_name = fake.word()
    while Project.query.filter_by(name=project_name).first():
        project_name = fake.word()
    project = Project(project_name, fake.sentence())
    return project

def create_fake_time_entry(user, project):
    start_time = fake.date_time_this_year(before_now=True, after_now=False)
    end_time = start_time + timedelta(hours=1)
    time_entry = TimeEntry(user, project, start_time, end_time, fake.sentence())
    return time_entry

def create_fake_data(app, num_users=10, num_projects=5, entries_per_user=5):
    with app.app_context():
        db.drop_all()
        db.create_all()
        users = []
        projects = []
        time_entries = []
        for i in range(num_users):
            user = create_fake_user()
            users.append(user)
            db.session.add(user)
        for i in range(num_projects):
            project = create_fake_project()
            projects.append(project)
            db.session.add(project)
        for user in users:
            for i in range(entries_per_user):
                project = projects[fake.random_int(0, len(projects)-1)]
                time_entry = create_fake_time_entry(user, project)
                time_entries.append(time_entry)
                db.session.add(time_entry)
        db.session.commit()
        return users, projects, time_entries