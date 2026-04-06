# Hospital Appointment Booking

A comprehensive Hospital Appointment Booking platform built using the MERN stack context (MongoDB, Express, React, Node.js) with Next.js serving as the full-stack framework. 

This application allows patients to easily book appointments with doctors and intelligently manages the booking process, ensuring no double-booking of time slots and securely storing user details in MongoDB.

## 🚀 Features

* **User Authentication:** 
  * Registration and Login functionality.
  * Captures mobile numbers during registration for better communication and record keeping.
* **Appointment Booking System:**
  * View available time slots for doctors.
  * Book a specific time slot.
  * **Real-time slot management:** Once a time slot is booked, it is marked as unavailable.
  * **Conflict resolution:** Alerts users if they attempt to book an already occupied time slot.
* **Database Management:** 
  * Utilizes **MongoDB** via Mongoose to persistently and securely store user data, hospital details, and booking information (migrated from `localStorage` in earlier versions).
* **Responsive Design:**
  * Clean, intuitive UI built with React and modern CSS features.

## 🛠️ Tech Stack

* **Frontend:** React.js, Next.js, TypeScript, Vanilla CSS Modules
* **Backend:** Next.js API Routes (Serverless Node.js backend)
* **Database:** MongoDB (via Mongoose)
* **Linting/Formatting:** ESLint

## 📁 Project Structure

* **`app/`**: Contains the React components and Next.js App Router endpoints for the frontend and backend.
  * **`app/auth/`**: Authentication pages (Login, Register).
  * **`app/api/`**: Backend Next.js API routes that connect frontend actions to the MongoDB database.
* **`models/`**: Defines the Mongoose schemas for Users, Appointments, and other entities.

## ⚙️ Local Development Setup

To run this project locally, follow these steps:

### Prerequisites

* **Node.js** (v18.x or higher)
* **npm** or **yarn**
* A **MongoDB** Database (either a local instance running on `mongodb://localhost:27017` or a cloud MongoDB Atlas URI).

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd "Hospital Apointment Booking(MernStack Project)"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your MongoDB connection string and any other required secrets.
   ```env
   MONGODB_URI=mongodb://localhost:27017/hospital_booking
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the App**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📜 Scripts

* `npm run dev`: Starts the Next.js development server.
* `npm run build`: Builds the app for production.
* `npm run start`: Runs the built application in a production environment.
* `npm run lint`: Runs ESLint to check for code issues.

## 🤝 Contributing

Contributions are welcome! If you find a bug or want to enhance the application, please fork the repository and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
