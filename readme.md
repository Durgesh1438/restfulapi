# Restful API of a simple blogging application

## Description
It provides  user login facility associated with authorization and authentication and creation/deletion/updation of posts by a particular user .

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [License](#license)

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Durgesh1438/backendapi.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd backendapi
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```

## Configuration
1. **Create a `.env` file** in the root directory of your project.
2. **Add the following environment variables** to the `.env` file:
   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   ```

## Database Setup
Ensure that your database is set up with the appropriate tables and configurations. You can find the database schema in the `db.sql` file.

## Database setup using xamp
Use xamp to run your db locally on your machine and check for appropriate connection to this db by following code given.

## Running the Application
To start the application, run the following command:
```bash
npm start
```

## Testing
To run tests, execute the following command:
```bash
npm test
```

## API Documentation
API documentation detailing endpoints, request/response formats, and authentication mechanism can be found in the `api_documentation.yaml` file.

## License
This project is licensed under the [MIT License](LICENSE).