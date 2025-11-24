# 🎯 CodeVertex – Frontend  
### **Modern Coding Practice Platform UI**

CodeVertex is an interactive coding practice platform designed for students, developers, and placement aspirants who want to strengthen their skills in **Data Structures**, **Algorithms**, and **Problem-Solving**.  
The frontend offers a clean, intuitive, and IDE-like experience for solving coding challenges.

---

## 🌟 About

CodeVertex provides:

- A smooth and intelligent UI experience  
- Real coding editor with syntax highlighting  
- Live code execution through backend Judge0 integration  
- Well-structured problem descriptions  
- Submission tracking  
- Editorial access  
- Authentication system  
- Simple and fast navigation  

The frontend is fully integrated with the **Codex Backend (Node.js + Express + MongoDB + Judge0)**.

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React.js** | Main UI framework |
| **Tailwind CSS** | Styling |
| **Axios** | API communication |
| **Monaco / CodeMirror** | Interactive code editor |
| **React Router** | Routing |
| **Context API / Redux** | State management |
| **JWT Tokens** | User authentication |

---

## 🚀 Features

### 🧩 Problem Workspace  
- View full problem details  
- Constraints & examples  
- Starter code per language  
- Editorial section  

### 💻 Code Editor  
- Syntax highlighting  
- Language support  
- Run functionality  
- Submit functionality  
- Shows output, errors, runtime info  

### 👤 User & Auth  
- Register/Login system  
- JWT-based authentication  
- Track solved problems  
- View submissions  

### 🧭 General UI  
- Home  
- Problems list  
- Problem details  
- Code editor panel  
- Editorial view  
- Profile  

---

## 📁 Folder Structure

```
codevertex-frontend/
│── src/
│   │── components/
│   │── pages/
│   │── context/
│   │── utils/
│   │── styles/
│   │── App.jsx
│   │── main.jsx
│
│── public/
│── package.json
│── README.md
```

---

## 🔐 Environment Variables (`.env`)

Create a `.env` file in the frontend root:

```env
VITE_BACKEND_URL=http://localhost:5000
```

(Replace with your deployed backend URL.)

---

## ▶️ Installation & Setup

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/yourusername/code-vertex-git-main-kanchanpundir2004.git
cd codevertex-frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

App runs at:
```
http://localhost:5173
```

---

## 🔗 Backend Repository

Codex Backend (Node.js + MongoDB + Judge0):  
https://github.com/yourusername/codex-backend

---

## 🚀 Future Enhancements

- Contest mode  
- Discussions/Comments  
- Leaderboard  
- Topic-wise practice  
- Hints system  
- Code auto-save  
- User streak tracking  

---

## 🤝 Contributing

Contributions are always welcome!  
Feel free to open Issues or PRs.

---
