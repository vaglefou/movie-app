

# Movie App

**Disclaimer**: This is an educational project. For ease of testing, the `.env` file and admin credentials are included in the repository. Do not use this setup in a production environment.

The default admin credentials are:

- **Email**: `admin@movieapp.com`
- **Password**: `Password@123`

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation with Swagger](#api-documentation-with-swagger)

## About the Project

**Movie App** is a full-stack application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to:

- Register and log in.
- Create and manage personal movie collections.
- Search for movies using the OMDB API and add them to their collections.
- Admins can view all users and delete them, while regular users can only manage their own collections.

## Features

- **User Authentication**: Register, log in, and log out functionality.
- **Movie Collections**: Users can create, view, update, and delete their movie collections.
- **Movie Search**: Search for movies using the OMDB API and add them to collections.
- **Admin Role Auth**: Admins can view all users and delete them.
- **Responsive Design**: Built with Tailwind CSS for a clean and responsive UI.
- **Notifications**: Toastify for user-friendly notifications.
- **Pagination**: PrimeReact Paginator for efficient data handling.

## Technologies Used

- **Frontend**: React.js, TypeScript, Tailwind CSS, Toastify, PrimeReact Paginator
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **API Integration**: OMDB API
- **Tools**: Swagger for API documentation

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**

   ```bash
   git clone git@github.com:vaglefou/movie-app.git
   cd movie-app  
   ```      


2. **Install dependencies**
   ```
   cd api
   npm install
   cd ../client
   npm install
   ```
## Configuration
   **Set up the environment variables**

   The .env file is already provided for easy testing.
   Admin Credentials: The database seed includes an admin user for testing.

   ```
   Email: admin@movieapp.com
   Password: Password@123
   ```

   Otherwise you can modify the .env file to include your own keys.

##  Running the Application

   ```
   # Start the backend (API folder)
   cd api
   npm start

   # Start the frontend (Client folder)
   cd ../client
   npm start
   ```

**Access the app**
```
http://localhost:3000
```

## API Documentation with Swagger
The API is documented using Swagger. You can access the documentation by running the backend and navigating to:
```
http://localhost:5000/api-docs
```