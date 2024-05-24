# PHONEBOOK_CA REST API

This project is a REST API built with Node.js, Express.js, Sequelize, MySQL, Zod, and Nodemon. The API provides functionality for user registration, contact management, spam reporting, and searching for contacts based on name or phone number.

## Tech Stack

- JavaScript (Note: )
- Node.js
- Express.js
- MySQL
- Prisma (ORM)
- Zod (Data validation)
- dotenv (Environment variables)
- Nodemon (Development server)

> [!Note]
> *TypeScript was not used, As the project requirements mentioned Node.js, and I wanted to avoid any potential disqualification due to misunderstanding the requirements.*

## Features

- User registration with name, phone number, email, and password
- User authentication
- Adding and managing personal contacts
- Marking a phone number as spam
- Searching for contacts by name or phone number
- Displaying contact details, including spam likelihood and email (if the user is in the contact's list)
- Rate limiting to prevent abuse
- Singleton pattern implementation for database connection and user authentication

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the MySQL database and update the `.env` file with the appropriate credentials. see `.env_example` for getting an idea
4. Run the migrations: `npx prisma migrate dev`
5. Start the Application: `npm start`

### Or run with Docker

1. Build Image - `docker build -t phonebook_ca .`
2. Run `docker run -p 3000:3000 phonebook_ca`

## Usage

The API endpoints can be accessed at `http://localhost:3000`. You can use tools like Postman or cURL to interact with the API.

## DATABASE SEEDING

To start the database seeding, use the following command: `npm seed`

## Code Structure

- `src/index.js`: Entry point of the application
- `src/routes/`: Contains route definitions for different endpoints
- `src/controllers/`: Handles the logic for each route
- `src/services/`: Business logic and data access layer
- `src/middleware/`: Custom middleware functions
- `src/config/`: Configuration files
- `src/validations/`: Contains all requests validations

## Patterns and Best Practices Used

- Rate limiting: Implemented rate limiting to prevent abuse and protect the API from excessive requests.
- Singleton pattern: Used the singleton pattern for the database connection and user authentication to ensure a single instance is shared throughout the application.
- Data validation: Utilized Zod for input data validation to ensure data integrity and security.
- Environment variables: Sensitive information like database credentials is stored in environment variables using the `dotenv` package.
- Error handling: Centralized error handling and consistent error responses.
- Code structure: Followed the principles of separation of concerns and modular design.
- Implemented authentication using JSON Web Tokens (JWT)

## Future Improvements

- Integrate with a caching mechanism for improved performance
- Implement pagination for large result sets
- Add support for HTTPS and SSL/TLS encryption
- Implement logging and monitoring for better visibility and debugging