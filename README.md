# 🧠 Online Examination Portal

## 📌 Project Overview

The **Online Examination Portal** is a web-based quiz system that allows users to take a timed examination with randomly selected questions.
The system provides an interactive interface for answering questions, navigating between them, and reviewing results after the exam.

The project is built using **HTML, CSS, and JavaScript** with a modern UI powered by **Tailwind CSS**.

---

## 🚀 Features

* 📊 **Random Question Selection** from a question bank
* ⏱ **15-minute countdown timer**
* 🧭 **Next / Previous navigation** between questions
* 📈 **Progress bar** to track exam completion
* ✅ **Automatic score calculation**
* 📋 **Detailed result review**
* 🎨 **Responsive UI with Tailwind CSS**
* ⚡ **Smooth animations and transitions**

---

## 🛠 Technologies Used

* **HTML5** – Structure of the application
* **CSS3** – Styling and custom UI
* **Tailwind CSS** – Responsive design framework
* **JavaScript (ES6)** – Application logic
* **JSON** – Question database storage

---

## 📂 Project Structure

```
online-exam-portal
│
├── index.html        # Main user interface
├── project.css       # Custom styling
├── project.js        # Exam logic and functionality
├── questions.json    # Question database
└── README.md         # Project documentation
```

---

## ⚙️ How the System Works

1. The exam loads questions from **questions.json**.
2. The system randomly selects **15 questions** for the exam.
3. A **15-minute timer** starts when the exam begins.
4. Users can:

   * Select answers
   * Navigate between questions
5. After submission or when time ends:

   * Score is calculated
   * Percentage is displayed
   * A detailed review of answers is shown.

---

## 🖥 User Interface

The portal includes three main screens:

### 1️⃣ Start Screen

Displays exam instructions and a **Start Examination** button.

### 2️⃣ Quiz Screen

Shows:

* Question text
* Multiple-choice options
* Timer
* Progress bar
* Navigation buttons

### 3️⃣ Result Screen

Displays:

* Total score
* Percentage
* Detailed answer review

---

## ▶️ How to Run the Project

1. Download or clone the repository

```
git clone https://github.com/yourusername/online-exam-portal.git
```

2. Open the project folder.

3. Run it using a **local server** (recommended).

Example using **Live Server** in VS Code:

* Right click `index.html`
* Click **Open with Live Server**

---

## 📊 Question Database

Questions are stored in **questions.json** in the format:

```
{
  "id": 1,
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 0
}
```

This makes it easy to add or modify questions.

---

## 📈 Future Improvements

* 🔐 User login and authentication
* 📊 Admin dashboard for managing questions
* 📄 Export results to PDF
* ☁ Database integration
* 🧠 AI-generated questions

---

## 👨‍💻 Author

**Deekshitulu**

---

## 📜 License

This project is created for **educational purposes**.
