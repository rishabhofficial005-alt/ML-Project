# 🧠 Mental Health Score Prediction System

An end-to-end machine learning application that predicts a student's mental health score based on social media usage, lifestyle habits, academic workload, sleep patterns, and stress levels.

The application combines machine learning, FastAPI, and a responsive web interface to deliver real-time predictions.

---

## 🚀 Live Features

* Interactive web interface
* Real-time mental health score prediction
* Machine learning model deployment using FastAPI
* Input validation using Pydantic
* Responsive user interface
* Dynamic range sliders
* Error handling and loading indicators
* REST API support

---

## 🏗️ System Architecture

```text
User
   │
   ▼
Frontend (HTML + CSS + JavaScript)
   │
   ▼
FastAPI Backend
   │
   ▼
Preprocessing Pipeline
   │
   ▼
Trained Machine Learning Model
   │
   ▼
Prediction Response
```

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Machine Learning

* Scikit-learn
* Pandas
* Joblib

### Development Tools

* Jupyter Notebook
* Git
* GitHub

---

## 📂 Project Structure

```text
Mental-Health-Score-Prediction/
│
├── app.py
├── requirements.txt
├── Mental_Health_Score_Prediction_Model.pkl
├── Untitled1.ipynb
│
├── static/
│   ├── index.html
│   ├── script.js
│   └── styles.css
│
└── README.md
```

---

## 📊 Input Features

The prediction model uses the following features:

| Feature               | Description                                   |
| --------------------- | --------------------------------------------- |
| Age                   | Student age                                   |
| Gender                | Gender                                        |
| Academic Level        | Educational qualification                     |
| Country               | Country of residence                          |
| Social Media Platform | Most frequently used platform                 |
| Purpose of Usage      | Networking, education, entertainment, or news |
| Daily Usage Hours     | Average daily screen time                     |
| Daily Unlocks         | Number of device unlocks                      |
| Study Hours           | Daily study duration                          |
| Physical Activity     | Daily exercise time                           |
| Sleep Duration        | Average sleep hours                           |
| Stress Level          | Self-reported stress level                    |

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/Mental-Health-Score-Prediction.git

cd Mental-Health-Score-Prediction
```

---

### Create a virtual environment

```bash
python -m venv venv
```

---

### Activate the environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux/macOS

```bash
source venv/bin/activate
```

---

### Install dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the application

Start the FastAPI server:

```bash
uvicorn app:app --reload
```

The application will be available at:

```text
http://127.0.0.1:8000
```

---

## 🔌 API Endpoints

### Home Page

```http
GET /
```

---

### Health Check

```http
GET /health
```

---

### Prediction Endpoint

```http
POST /predict
```

### Example Request

```json
{
    "Age": 21,
    "Gender": "Male",
    "Academic_Level": "Undergraduate",
    "Country": "India",
    "Most_Used_Platform": "Instagram",
    "Purpose_Of_Use": "Entertainment",
    "Avg_Daily_Usage_Hours": 5,
    "Daily_Unlocks": 45,
    "Study_Hours": 4,
    "Physical_Activity_Hours": 1,
    "Sleep_Hours_Per_Night": 7,
    "Stress_Level": "Medium"
}
```

---





## 📈 Project Workflow

* Data collection
* Data cleaning
* Exploratory data analysis (EDA)
* Feature engineering
* Model development
* Hyperparameter tuning
* Model evaluation
* Model deployment
* Frontend integration

---

## 🖥️ User Interface

The application provides:

* A modern, responsive design
* Interactive sliders
* Form validation
* Loading animations
* Error notifications
* Instant prediction results

---

## 🔮 Future Improvements

* Docker deployment
* Cloud deployment
* User authentication
* Recommendation engine
* Sentiment analysis integration
* Deep learning implementation

---

## 👨‍💻 Author

### Rishabh Singh

Final-year Computer Science undergraduate passionate about:

* Data Analytics
* Machine Learning
* FastAPI Development
* Artificial Intelligence

---

⭐ If you like this project, consider starring the repository.
