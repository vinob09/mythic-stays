<h1><img src="frontend/public/Mythic-Stays-logo.png"></h1>

![Javascript](https://img.shields.io/badge/JavaScript-orange?logo=javascript&logoColor=white)
![React](https://img.shields.io/badge/React-white?logo=react&logoColor=blue)
![Redux](https://img.shields.io/badge/Redux-white?logo=redux&logoColor=purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-white?logo=postgresql&logoColor=blue)
![Sequelize](https://img.shields.io/badge/Sequelize-white?logo=sequelize&logoColor=blue)
![HTML5](https://img.shields.io/badge/HTML5-orange?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-white?logo=css3&logoColor=blue)

## 🧾Table of Contents
* [Introduction](#introduction)
* [Features](#features)
* [Getting Started](#getting-started)
* [Backend Details](#backend-details)

## Introduction
Welcome to Mythic Stays, a school project meant to mimic the functionalities of that shall not be named. The project focuses on delivering a seamless user experience with a robust design that is intuitive and responsive. This project highlights full-stack development, utilizing modern web technologies and frameworks, and allows users to browse and review mythical accomodations. The backend is built with Express.js and uses Sequelize as the ORM, while the frontend is developed using React and Redux. As the name implies, Mythic Stays is not a real website and is meant for learning purposes only.

### Live Site: *[Mythic Stays](https://mythic-stays.onrender.com/)*

<img src="images/screen.png" width="50%" height="50%" alt="mythic-stays"><br><img src="images/screen-1.png" width="50%" height="50%" alt="mythic-stays-details">

## Features
* User authentication and authorization
* Browse functionalities
* Leave reviews and ratings
* View and manage lodgings

## Getting Started
Before you begin, ensure you have the following installed:

### Prerequisites
1.  Node.js (version 14.x or higher recommended)
2.  npm (usually comes with Node.js)
3.  Git

### Setup
1. To clone the project.
    ```bash
    git clone https://github.com/vinob09/mythic-stays.git
    cd mythic-stays
    ```

2. In the `backend` directory, create a `.env` file based on the `.env.example` file provided.

3. Install backend dependencies and setup SQLite development database.
    ```bash
    npm install
    npx dotenv sequelize db:migrate
    npx dotenv sequelize db:seed:all
    ```
4. Install frontend dependencies.
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application
1. In the `backend` directory, run `npm start` to start the backend server in development mode using nodemon.

2. In the `frontend` directory, run `npm run dev` to start the frontend Vite development server.

## Backend Details
Detailed information about the database schema and API endpoints can be found in the `backend` folder of this repository.
