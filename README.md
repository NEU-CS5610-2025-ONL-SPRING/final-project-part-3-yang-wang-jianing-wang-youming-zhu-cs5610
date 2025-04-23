# Travel Tip Website - Fullstack Web Application

This is a fullstack travel tip web application that allows users to share travel experiences and explore tips posted by others. Users can create and view posts that include a title, description, location, image, and author information. The project features a React frontend and a Node.js backend connected to a MySQL database.

# Deploy:
[https://client-liart-rho.vercel.app/](https://client-liart-rho.vercel.app/)




## ✨ Features

- View travel tips posted by other users
- Add new travel posts with details like title, image, and location
- Search and browse by keywords
- Simple user authentication using JWT
- Automatically retrieve ratings of the place via Google Place API

## 📁 Project Structure

```
final-project-part-2-yang-wang-jianing-wang-youming-zhu-cs5610/
├── api/                     # Backend (Node.js + Express)
│   ├── prisma/              
│   │   └── schema.prisma    
│   ├── src/                 
│   │   ├── routes/          
│   │   ├── middleware/      
│   │   └── index.js         # Entry point for backend
│   ├── .env                 
│   ├── package.json         
├── client/                  # Frontend (React)
│   ├── src/                 
│   │   ├── components/      
│   │   ├── pages/           # Page components for routing
│   │   ├── App.jsx          
│   │   └── index.jsx        # Entry point for React app
│   ├── public/              
│   │   └── index.html       
│   ├── package.json         
├── .gitignore               
├── README.md                
```

## 🚀 Getting Started

### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your `.env` file in the `api` directory (see below).

4. Run the backend server:
   ```bash
   node src/index.js
   ```

### 2. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`.

## 🔐 .env Configuration

Create a `.env` file inside the `api` folder with the following content:

```env
DATABASE_URL="mysql://root:yourPassword@localhost:3306/cs5610FinalProject"
JWT_SECRET=your-jwt-secret
```

- `DATABASE_URL`: Replace `yourPassword` with your local MySQL root password.
- `JWT_SECRET`: Replace with a secure random string for signing JWT tokens.

> 🛡️ `.env` is already included in `.gitignore` and will not be committed to version control.

## 📝 Tech Stack

- **Frontend**: React, JavaScript, HTML/CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## deployment instructions: https://docs.google.com/document/d/1EAXheb9Q7at094xKAhRikD5uQE15q7G_OWaC5KmuARc/edit?usp=sharing