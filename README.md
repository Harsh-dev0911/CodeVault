# CodeVault - Online Code Snippet Manager (Vanilla Edition)

CodeVault is a premium full-stack web application designed for developers to manage and store their code snippets with syntax highlighting. Built using Node.js, Express, MongoDB Atlas, and deeply styled Vanilla HTML, CSS, and Javascript. 

## Features

- **User Authentication:** Secure JWT-based Login and Registration.
- **Snippet Management:** Create, read, update, and delete your code snippets natively using Fetch API.
- **Syntax Highlighting:** Integrated CDN `prismjs` natively in HTML for premium snippet rendering.
- **Search & Filter:** Find saved snippets instantly via title filtering.
- **Premium UI:** Custom dark-themed Glassmorphism aesthetic leveraging modern CSS. 
- **Zero-Build Architecture:** The frontend utilizes generic `.js` and `.css` scripts served identically by the core server, bypassing the requirement for heavy bundlers like Webpack or Vite.

## Tech Stack

- **Frontend:** Pure HTML5, CSS3, DOM Javascript, PrismJS Array (via CDN)
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas

## Getting Started

### 1. MongoDB Setup
1. Open MongoDB Compass or Atlas.
2. Get your connection string (URI).
3. Open `backend/.env` and replace the placeholder `MONGO_URI` with your connection string.

### 2. Server Setup
Since the Node `/backend` is configured to inherently serve the `/frontend` assets transparently via `express.static()`, running the project only takes one step!

```bash
cd backend
npm install
nodemon server.js
```

Then visit `http://localhost:5000/` in your browser. You will be greeted by `index.html` allowing you to securely log in.
