# Elevate LMS (Academia Pro) 🚀

Elevate is a premium, high-performance Learning Management System (LMS) designed for modern digital education. Built with **Laravel** and **React**, it offers a seamless experience for administrators, instructors, and students.

## 🌟 Key Features

- **Premium Design**: Sleek, dark-mode interface with smooth animations and responsive layouts.
- **Smart Attendance**: QR-based attendance system with geolocation validation.
- **Device-Bound Security**: Account protection system that binds student accounts to specific devices.
- **Dynamic Dashboards**: Role-based analytics using a sophisticated "Bento Grid" design.
- **Interactive Community**: Discussion forums and post sharing for students and instructors.
- **Assignment Management**: Full lifecycle for assignments including submission, grading, and feedback.
- **Verified Certificates**: Automated generation of verifiable certificates upon completion.

## 🛠️ Technology Stack

- **Backend**: Laravel 11 (PHP)
- **Frontend**: React.js, Tailwind CSS, Vite
- **Database**: MySQL / PostgreSQL
- **Real-time**: Laravel Reverb / WebSockets (Planned)

## 📁 Project Structure

- `elevate-backend/`: The Laravel core API.
- `elevate-frontend/`: The React-based user interface.

## 🚀 Getting Started

### Backend Setup
1. Navigate to `elevate-backend/`
2. Run `composer install`
3. Copy `.env.example` to `.env` and configure your database.
4. Run `php artisan migrate --seed`
5. Start the server: `php artisan serve`

### Frontend Setup
1. Navigate to `elevate-frontend/`
2. Run `npm install`
3. Start the development server: `npm run dev`

---
Developed with ❤️ for **Academia Pro**.
