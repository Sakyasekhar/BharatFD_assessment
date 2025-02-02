# BharatFD_assessment

Deployment link: ["sakya-sekhar-bharatfd-assessment.vercel.app"](https://sakya-sekhar-bharatfd-assessment.vercel.app/)
## Project Overview
This project is a FAQ management system that allows users to add, update, delete, and view FAQs in multiple languages. The system supports real-time translation caching using Redis and integrates Google Translate for dynamic translations.

## Features
- Add FAQs with English as the default language.
- Automatic translation of FAQs into other languages.
- Retrieve all FAQs in a selected language.
- Edit and delete FAQs (only available when English language selected).
- Caching using Redis to improve performance.

## Technologies Used
- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** React.js
- **Caching:** Redis
- **Translation API:** Google Translate API

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- MongoDB
- Redis

### Setup Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/BharatFD_assessment.git
   cd BharatFD_assessment
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```
   MONGO_URI=your_mongodb_connection_string
   REDIS_PASSWORD=your_password
   ```
4. Start the backend server:
   ```sh
   cd server
   node app.js
   ```
5. Navigate to the frontend directory and start the frontend:
   ```sh
   cd frontend
   npm start
   ```

## API Endpoints
SERVER_URL = [bharatfdassessment-server.up.railway.app](https://bharatfdassessment-server.up.railway.app)
### 1. Add an FAQ
**POST** `/api/faq/add`
#### Request Body:
```json
{
  "question": "What is BharatFD?",
  "answer": "BharatFD is a financial management platform."
}
```
#### Response:
```json
{
  "message": "FAQ added successfully",
  "faq": {
    "question": "What is BharatFD?",
    "answer": "BharatFD is a financial management platform.",
    "translations": {
      "en": {
        "question": "What is BharatFD?",
        "answer": "BharatFD is a financial management platform."
      }
    }
  }
}
```

### 2. View Translated FAQs
**GET** `/api/faqs/?lang=fr`
#### Response:
```json
[
  {
    "question": "Qu'est-ce que BharatFD?",
    "answer": "BharatFD est une plateforme de gestion financière."
  }
]
```

### 3. Update an FAQ (English Only)
**PUT** `/api/faq/update/:id`
#### Request Body:
```json
{
  "question": "What is BharatFD?",
  "answer": "BharatFD is a digital finance platform."
}
```
#### Response:
```json
{
  "message": "FAQ updated successfully",
  "faq": {
    "question": "What is BharatFD?",
    "answer": "BharatFD is a digital finance platform."
  }
}
```

### 4. Delete an FAQ
**DELETE** `/api/faq/delete/:id`
#### Response:
```json
{
  "message": "FAQ deleted successfully"
}
```

## Frontend Functionality
- Displays FAQs in a selected language.
- Dropdown to choose different languages.
- Edit and delete buttons appear only when English is selected.
- Uses Axios to interact with the backend.

## Deployment
### Backend
Deployed using railway

### Frontend
Deployed using vercel

## Contact
For any issues, contact **sakya sekhar gangarapu** at **sakyasekhar.g@gmail.com**.

