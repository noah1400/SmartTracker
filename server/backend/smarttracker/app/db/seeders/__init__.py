from app.db.models import User, Project, TimeEntry, Role, Permission
from app.db import db
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()

def create_permissions():
    permissions = [
        Permission('create:time_entries', 'Create time entries'),
        Permission('read:time_entries', 'Read time entries'),
        Permission('update:time_entries', 'Update time entries'),
        Permission('delete:time_entries', 'Delete time entries'),
        Permission('create:projects', 'Create projects'),
        Permission('read:projects', 'Read projects'),
        Permission('update:projects', 'Update projects'),
        Permission('delete:projects', 'Delete projects'),
        Permission('create:own_time_entries', 'Create own time entries'),
        Permission('read:own_time_entries', 'Read own time entries'),
        Permission('update:own_time_entries', 'Update own time entries'),
        Permission('delete:own_time_entries', 'Delete own time entries'),
        Permission('create:own_projects', 'Create own projects'),
        Permission('read:own_projects', 'Read own projects'),
        Permission('update:own_projects', 'Update own projects'),
        Permission('delete:own_projects', 'Delete own projects'),
        Permission('read:own_user', 'Read own user'),
        Permission('update:own_user', 'Update own user'),
        Permission('delete:own_user', 'Delete own user'),
        Permission('create:users', 'Create users'),
        Permission('read:users', 'Read users'),
        Permission('update:users', 'Update users'),
        Permission('delete:users', 'Delete users'),
        Permission('create:roles', 'Create roles'),
        Permission('read:roles', 'Read roles'),
        Permission('update:roles', 'Update roles'),
        Permission('delete:roles', 'Delete roles'),
        Permission('create:permissions', 'Create permissions'),
        Permission('read:permissions', 'Read permissions'),
        Permission('update:permissions', 'Update permissions'),
        Permission('delete:permissions', 'Delete permissions')
    ]
    db.session.add_all(permissions)
    db.session.commit()

def create_roles_with_permissions():
    create_permissions()
    admin = Role('admin', 'Administrator')
    user = Role('user', 'User')

    db.session.add(admin)
    db.session.add(user)
    db.session.commit()

    adminPermissions = Permission.query.all()
    admin.permissions = adminPermissions

    userPermissions = Permission.query.filter(Permission.name.like('read:own_%')).all()
    userPermissions += Permission.query.filter(Permission.name.like('update:own_%')).all()
    userPermissions += Permission.query.filter(Permission.name.like('create:own_%')).all()
    userPermissions += Permission.query.filter(Permission.name.like('delete:own_%')).all()

    user.permissions = userPermissions

    db.session.add(admin)
    db.session.add(user)
    db.session.commit()



def create_fake_user():
    username = fake.user_name()
    while User.query.filter_by(username=username).first():
        username = fake.user_name()
    user = User.create_with_role(username, fake.email(), '1234', 'internal', 'user')
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
        create_roles_with_permissions()
        for i in range(num_users):
            user = create_fake_user()
            users.append(user)
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

        try:
            admin = User.create_with_role('admin', 'admin@example.com', 'admin', 'internal', 'admin')
            user = User.create_with_role('user', 'user@example.com', 'user', 'internal', 'user')
        except:
            pass
        return users, projects, time_entries