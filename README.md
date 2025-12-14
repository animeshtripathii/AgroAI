# 🌱 AgroAI - AI-Powered Agricultural Platform

A comprehensive full-stack application designed to empower farmers with AI-driven insights, weather forecasts, and crop management tools. Built with the MERN stack (MongoDB, Express, React, Node.js) and enhanced with Google's Gemini AI.

## 🚀 Features

- **AI Crop Recommendation**: Machine learning-based suggestions for the best crops to grow based on soil and weather conditions.
- **Smart Soil Health Reports**: Generates detailed PDF reports analyzing soil health using **Google Gemini AI**.
- **Real-time Weather Updates**: Live weather forecasting using the **OpenWeather API** to help farmers plan their activities.
- **Interactive Dashboard**: Visual analytics and charts (using **Recharts**) for production trends and yield analysis.
- **Community & User Profiles**: Secure authentication system with profile management and image uploads (using **Cloudinary**).
- **Responsive Modern UI**: Built with **React**, **Vite**, **Tailwind CSS**, and **Shadcn UI** for a sleek, accessible experience across devices.
- **Smooth Animations**: Enhanced user experience with **Framer Motion** transitions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Context / Hooks
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Visualizations**: Recharts
- **Animations**: Framer Motion, AOS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens), Bcrypt
- **File Storage**: Cloudinary (via Multer)
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **PDF Generation**: PDFKit

## 📂 Project Structure

This project follows a Monorepo structure:

```
├── client/          # React Frontend application
│   ├── src/
│   ├── public/
│   └── package.json
└── server/          # Node.js/Express Backend
    ├── controllers/
    ├── models/
    ├── routes/
    └── package.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas Account (or local MongoDB)
- Cloudinary Account
- Google Gemini API Key
- OpenWeather API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/AgroAI.git
cd AgroAI
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BASE_URL=http://localhost:5173
CROP_PREDICTION_API_URL=http://127.0.0.1:5000 (or external ML API)
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Start the backend server:
```bash
npm run dev
# or
node server.js
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FERTILIZER_ML_API_URL=your_fertilizer_api_url
VITE_OPENWEATHER_API_URL=https://api.openweathermap.org/data/2.5
VITE_OPENWEATHER_API_KEY=your_openweather_key
VITE_CROP_PREDICTION_API_URL=your_crop_prediction_url
```

Start the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

## 🚀 Deployment

The application is configured for deployment on **Vercel**.

1.  **Backend**: Deploy the `server` directory as a separate project or configure the root properly.
2.  **Frontend**: Deploy the `client` directory.
3.  Ensure all environment variables are set in your Vercel project settings.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
