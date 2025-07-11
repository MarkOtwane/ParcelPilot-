# 📦 ParcelPilot Courier System

ParcelPilot is a full-stack courier management platform built to streamline parcel delivery operations for individuals and administrators. Designed with modern web technologies, it provides a seamless user experience for managing parcel orders, real-time delivery tracking, and notifications.


## 🚀 Project Overview

**ParcelPilot** offers a robust set of features to improve transparency, efficiency, and user engagement in courier services.
It consists of:

* A **user portal** for sending, receiving, and tracking parcels.
* An **admin dashboard** for managing users, parcels, and delivery statuses.
* A responsive frontend with maps, image uploads, and dynamic feedback.
* A scalable backend supporting secure APIs, file handling, and background email/SMS services.

## 🧩 Features

### 👤 User Features

* **Secure Authentication:** Register and login with JWT-based auth.
* **Parcel Dashboard:**

  * View all parcels sent by the user.
  * View all parcels received by the user.
* **Real-time Notifications:** Email and SMS alerts on parcel status changes (pending, in-transit, delivered).
* **Welcome Email:** Automatically sent after successful registration.

### 🛠️ Admin Features

* **Parcel Management:** Create and update parcel delivery orders.
* **Status Control:** Change parcel delivery status with real-time notification triggers.
* **User Oversight:** View all registered users and their parcels.
* **Communication Control:** Manually trigger notifications if needed.

### 🌍 General System Features

* **Map Integration:** Google Maps API shows pickup and destination locations with markers.
* **Image Uploads:** Integrated Cloudinary support for parcel-related media.
* **Role-Based Access Control:** Secure user/admin separation at route and feature level.
* **Search & Pagination:** Efficient navigation through large data sets.
* **Dynamic Notification Component:** Unified success/error feedback for a smooth UX.

## 🧱 Tech Stack

### 🔧 Backend

* **Framework:** NestJS
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (with role-based guards)
* **Validation:** JOI DTO schemas
* **Email Service:** Nodemailer
* **SMS Service:** Twilio
* **Cloud Storage:** Cloudinary
* **Soft Delete Support:** Prisma-level logic for recoverable deletions

### 🎨 Frontend

* **Framework:** Angular
* **Styling:** SCSS
* **State Management:** NgRx
* **Forms:** Template-driven for login, reactive for all others
* **Mapping:** Google Maps API
* **File Uploads:** Cloudinary integration
* **UX Enhancements:** Pipes, directives, guards, lazy loading, dynamic feedback

---

## 📁 Folder Structure

### Backend (`sendit-backend/`)

```
sendit-backend/
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── auth/              # JWT auth, login, register
│   ├── users/             # User management
│   ├── parcels/           # Parcel logic and status updates
│   ├── notifications/     # Email & SMS services
│   ├── cloudinary/        # Cloudinary service module
│   ├── shared/            # Guards, decorators, filters
│   ├── config/            # Environment and validation
│   ├── app.module.ts      # App root module
│   └── main.ts            # Entry point
├── .env
└── package.json
```

### Frontend (`sendit-frontend/`)

```
sendit-frontend/
├── src/
│   ├── app/
│   │   ├── core/          # Guards, services, models
│   │   ├── shared/        # UI components, directives, pipes
│   │   ├── auth/          # Login/Register
│   │   ├── user/          # Sent/received parcels
│   │   ├── admin/         # Manage users and parcels
│   │   ├── parcels/       # Parcel creation, detail view
│   │   ├── store/         # NgRx slices
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
├── environments/          # API and Map keys
├── assets/
└── styles.scss
```

---

## 🛠️ Getting Started

### 🔑 Prerequisites

* Node.js (LTS)
* PostgreSQL
* Angular CLI (`npm install -g @angular/cli`)
* NestJS CLI (`npm install -g @nestjs/cli`)


## 📦 Backend Setup

```bash
git clone <your-backend-repo-url> sendit-backend
cd sendit-backend
npm install
```

### Environment Configuration

Create a `.env` file in the root with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sendit_db?schema=public"
JWT_SECRET="your_jwt_secret_key"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

EMAIL_SERVICE_HOST="smtp.example.com"
EMAIL_SERVICE_PORT="587"
EMAIL_SERVICE_USER="your_email@example.com"
EMAIL_SERVICE_PASS="your_email_password"

TWILIO_ACCOUNT_SID="your_twilio_sid"
TWILIO_AUTH_TOKEN="your_twilio_token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Database & Server Start

```bash
npx prisma migrate dev --name init
npm run start:dev
# API available at http://localhost:3000
```


## 🌐 Frontend Setup

```bash
git clone <your-frontend-repo-url> sendit-frontend
cd sendit-frontend
npm install
```

### Configure Environment

Edit `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  cloudinaryCloudName: 'your_cloudinary_cloud_name'
};
```

### Launch App

```bash
ng serve
# App available at http://localhost:4200
```

---

## 🧪 Usage

1. Open `http://localhost:4200` in your browser.
2. Register a new account.
3. Login to the system.
4. View parcels you’ve sent and received.
5. If you’re an admin, access admin features like parcel creation, status updates, and user management.

---

## 👥 Contributing

1. Fork the repository.
2. Create a new feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. Make changes, commit, and push:

   ```bash
   git commit -m "Added feature"
   git push origin feature/your-feature
   ```
4. Open a Pull Request.


## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## ❤️ Authors

**ParcelPilot Courier System** — Developed with passion by Mark Otwane.
