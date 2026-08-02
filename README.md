# Solar Panel Efficiency Monitoring System

A full-stack MERN application for monitoring the performance and efficiency of solar panels through an interactive analytics dashboard. The platform enables users to track energy production, monitor panel health, analyze historical performance, manage maintenance activities, and generate reports.

## Features

- Secure user authentication
- Interactive dashboard
- Solar panel monitoring
- Energy production analytics
- Efficiency tracking
- Performance charts
- Maintenance management
- Alert management
- Report generation
- Responsive design
- Dark and Light mode support

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vite
- React Router DOM
- Axios
- Chart.js
- Lucide React

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)

---

## Project Structure

```
Solar-Panel-Efficiency-Monitoring/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Navigate to the project

```bash
cd Solar-Panel-Efficiency-Monitoring
```

---

## Install Dependencies

### Client

```bash
cd client
npm install
```

### Server

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=6000
MONGO_URI=mongodb://127.0.0.1:27017/solar_monitoring
JWT_SECRET=your_secret_key
```

---

## Run the Backend

```bash
cd server
npm start
```

---

## Run the Frontend

```bash
cd client
npm run dev
```

---

## Application URLs

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:6000
```

---

## Core Modules

- Authentication
- Dashboard
- Solar Panel Monitoring
- Analytics
- Alerts
- Maintenance
- Reports
- User Profile
- Settings

---

## Dashboard Metrics

- Total Panels
- Active Panels
- Offline Panels
- Average Efficiency
- Today's Energy Production
- Monthly Energy Production
- Carbon Emissions Saved
- Estimated Revenue

---

## Future Enhancements

- IoT sensor integration
- Real-time data streaming
- Weather API integration
- Predictive maintenance using Machine Learning
- Mobile application
- Email and SMS notifications
- Role-based access control
- Multi-location monitoring

---

## License

This project is developed for educational and learning purposes.