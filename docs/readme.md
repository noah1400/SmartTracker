# Smart Tracker

## Documentation
The documentation for this project can be found here:

--> please send a mail to grant access.

# Installation Guide

## Desktop Application

### Installing Libraries
To install the necessary libraries for the SmartTracker application, first open a terminal window in the project's directory `/SmartTracker/desktop/usb-con/`. Then execute the following command:

```
npm install
```

This command downloads all the dependencies listed in the `package.json` file. This process may take a few minutes, depending on your internet speed and your computer's performance.

### Building the App
After all libraries have been installed, you can build the application. This step compiles the code and prepares everything for execution. Execute the following command in the terminal:
```
npm run package
```
This command runs the `package` script defined in the `package.json` file. It creates an executable version of the application for your operating system. The process may take some time and will provide a notification once the build is complete.

### Launching the Application
After successfully building the application, you can start it. In the project directory, look for the created executable file and double-click it to launch the application. This may vary slightly depending on your operating system.

### Troubleshooting
If errors occur during the installation or build process, check the console output for specific error messages. Common issues may include missing dependencies or version conflicts. Ensure you have the latest version of Node.js and npm installed and that your internet connection is stable.

## Server Application

### Preparing the Docker Environment
Before beginning the installation of the server application, make sure Docker is installed on your system. For users of Docker Desktop on Windows or macOS, as well as Docker on Linux servers, follow the official Docker installation guides.

### Creating Configuration Files
#### Creating the password.txt
Navigate to the directory `/SmartTracker/server/db` and create a file named `password.txt`. Insert the following content into this file:
```
abcdefg1234!

```

#### Creating the .env File
Switch to the directory `/SmartTracker/server/backend` and create a file named `.env`. Insert the following environment variables into the `.env` file:

```
SECRET_KEY='secretskdjsdfjkkjjkksjdfkjs'
DB_HOST='db'
DB_USER='root'
DB_PASSWORD='abcdefg1234!'
DB_NAME='example'
DB_PORT=3306
DB_DRIVER='mysql'
SQLALCHEMY_DATABASE_URI='mysql://root:{DB_PASSWORD}@db:3306/example
```
Ensure that you adjust the values according to your environment and security requirements.

### Building and Starting the Docker Containers
#### Building the Docker Containers
Open a terminal in the directory `/SmartTracker/server` and execute the following command to build the Docker container:

```
docker compose build --build-arg="KEYSTORE_PASSWORD=password"
```
This step creates all required Docker images based on the instructions in your `docker-compose.yml` file.

#### Starting the Docker Containers
After successfully building the Docker images, start the containers with the following command:


```
docker compose up -d
```

This command starts all services defined in your `docker-compose.yml` file in the background.

### Verifying the Installation
After the containers have been successfully started, follow these steps to verify that the installation was correctly completed.
#### Checking Container Logs
First, check the logs of the Docker containers to ensure that no errors have occurred. Open a terminal and execute the command `docker compose logs`. Make sure that all services have started properly and that no error messages are displayed.

#### Accessing the Web Interface
After confirming that the Docker containers are running properly, open a web browser and navigate to the following address:

http://localhost/web

This should display the web interface of your application. If you can successfully see the web interface, this means that the server application is functioning correctly. Check the functionality of the web interface to ensure that all components are working as expected.

#### Troubleshooting
If you encounter problems accessing the web interface, check whether the relevant Docker service is running and if the port configurations are set correctly. Also, ensure that no firewall or other network settings are blocking access to the server.
