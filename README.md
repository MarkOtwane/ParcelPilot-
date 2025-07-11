SendIT Courier System
Project Overview
SendIT is a full-stack courier management platform designed to streamline parcel delivery operations. It provides a user-friendly interface for individuals to send and receive parcels, track their orders in real-time, and receive timely notifications. For administrators, SendIT offers robust tools to manage delivery operations, create new orders, update parcel statuses, and oversee all users and parcels within the system.

The primary goal of SendIT is to enhance efficiency and transparency in parcel delivery, ensuring a seamless experience for both users and administrators.

Features
User Features
Account Management: Secure registration and login with robust validation.

Personal Parcel Tracking:

View all parcels sent by the user.

View all parcels received by the user.

Real-time Notifications: Receive email/SMS notifications for all parcel status updates (e.g., pending, in-transit, delivered).

Welcome Email: Automated welcome email upon successful registration.

Admin Features
Parcel Management: Create new parcel delivery orders.

Status Updates: Update the delivery status of any parcel (e.g., pending, in-transit, delivered).

Comprehensive View: View all users and all parcels registered in the system.

Notification Triggering: Manually trigger real-time delivery notifications to senders and receivers.

General Features
Map Integration: Visualize pickup and destination locations with markers using the Google Maps API.

Role-Based Access Control: Secure access to features based on user roles (Admin/User).

Dynamic Notification System: A unified component for displaying success and error messages across the application.

Search & Pagination: Efficiently search and paginate through lists of users and parcels.

Image Uploads: Integrated Cloudinary service for managing parcel-related images.

Tech Stack
Frontend
Framework: Angular (latest stable version)

State Management: NgRx

Styling: SCSS

Mapping: Google Maps API

File Uploads: Cloudinary integration for image uploads

Backend
Framework: NestJS

Database: PostgreSQL

ORM: Prisma

Authentication: JWT (JSON Web Tokens)

Email & SMS: Nodemailer / SMS API (e.g., Twilio)

File Uploads: Cloudinary service

Folder Structure
The project is divided into two main repositories: sendit-backend (NestJS) and sendit-frontend (Angular).

Backend (sendit-backend/)
sendit-backend/
│
├── prisma/                        # Prisma schema & migrations
├── src/
│   ├── auth/                      # JWT auth, login, register
│   ├── users/                     # User management (CRUD)
│   ├── parcels/                   # Parcel CRUD, status updates
│   ├── notifications/            # Email/SMS service (Nodemailer/Twilio)
│   ├── cloudinary/               # Cloudinary file upload service
│   ├── shared/                   # Reusable utilities, guards, decorators, filters
│   ├── config/                   # Environment configuration
│   ├── app.module.ts             # Root module
│   └── main.ts                   # Entry point
├── .env                          # Environment variables
├── tsconfig.json
├── package.json
└── README.md

Frontend (sendit-frontend/)
sendit-frontend/
│
├── src/
│   ├── app/
│   │   ├── core/                       # Singleton services, guards, interceptors, models
│   │   ├── shared/                     # Shared UI components, pipes, directives, modules
│   │   ├── auth/                       # Login, register, password reset
│   │   ├── user/                       # End-user specific features (dashboard, sent/received parcels)
│   │   ├── admin/                      # Admin specific features (manage users, parcels, reports)
│   │   ├── parcels/                    # Parcel CRUD (can be used by both admin for creation and user for viewing details)
│   │   ├── store/                      # NgRx state management slices
│   │   ├── app-routing.module.ts       # Main application routing
│   │   └── app.module.ts               # Root application module
├── environments/                     # Environment-specific configurations
├── assets/                           # Static assets (icons, images, logos)
├── index.html                        # Main HTML file
├── styles.scss                       # Global styles
├── angular.json                      # Angular CLI configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Project dependencies

Getting Started
Follow these instructions to set up and run the SendIT Courier System on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm (comes with Node.js)

PostgreSQL

Angular CLI (npm install -g @angular/cli)

NestJS CLI (npm install -g @nestjs/cli)

1. Backend Setup
Clone the repository:

git clone <your-backend-repo-url> sendit-backend
cd sendit-backend

Install dependencies:

npm install

Configure Environment Variables:
Create a .env file in the sendit-backend root directory and add the following:

DATABASE_URL="postgresql://user:password@localhost:5432/sendit_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
EMAIL_SERVICE_HOST="smtp.your-email-provider.com"
EMAIL_SERVICE_PORT="587"
EMAIL_SERVICE_USER="your_email@example.com"
EMAIL_SERVICE_PASS="your_email_password"
# For SMS, if using Twilio:
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="your_twilio_phone_number"

Replace placeholder values with your actual credentials.

Database Setup:

Ensure your PostgreSQL server is running.

Create a database named sendit_db.

Run Prisma migrations to set up the database schema:

npx prisma migrate dev --name init

Start the Backend Server:

npm run start:dev

The backend server will typically run on http://localhost:3000.

2. Frontend Setup
Clone the repository:

git clone <your-frontend-repo-url> sendit-frontend
cd sendit-frontend

Install dependencies:

npm install

Configure Environment Variables:
Open src/environments/environment.ts and src/environments/environment.prod.ts and update the apiUrl and googleMapsApiKey as follows:

// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // Or your deployed backend URL
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  cloudinaryCloudName: 'your_cloudinary_cloud_name' // If needed directly in frontend
};

Replace YOUR_GOOGLE_MAPS_API_KEY with your actual Google Maps API key.

Start the Frontend Application:

ng serve

The frontend application will typically run on http://localhost:4200.

Usage
Once both the backend and frontend servers are running:

Navigate to http://localhost:4200 in your web browser.

Register a new user account.

Login with your new credentials.

Explore the user dashboard to view sent/received parcels.

If you have admin privileges (configured in the database), you can access the admin panel to manage users and parcels.

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes.

Commit your changes (git commit -m 'Add new feature').

Push to the branch (git push origin feature/your-feature-name).

Open a Pull Request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Developed with ❤️ by Mark Otwane
