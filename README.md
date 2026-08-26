# Kanban Board

A React-based Kanban task management application for organizing tasks, users, sprints, and project progress.

## Features

- User authentication with Login / Sign Up / Logout
- Kanban board with customizable columns and task management
- Create, edit, delete, and assign tasks
- Task labels, priority, status, due dates, descriptions, comments, and attachments
- Image preview for task attachments
- User assignment and role-based restrictions
- Search and filter tasks/users
- Sprint management with task assignment and backlog
- Today's Scheduled, Published, and Bookmark task categories
- Responsive sidebar and navigation
- Data persistence using Local Storage

##  Tech Stack

- **Frontend:** React, React Router DOM, React Icons
- **Backend & Database:** Firebase Authentication, Firestore Real-time Database
- **Data Visualization:** Recharts
- **Drag and Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Build Tool:** Vite

## How to Run

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/kanban-board.git](https://github.com/YOUR_USERNAME/kanban-board.git)
   cd kanban-board
   ```
2. **Install Dependencies**
   ```
   npm install
   ```

3. **Configure Environment Variables**
- Create a .env file in the root directory and add your Firebase configuration details:

    ```
    VITE_FIREBASE_API_KEY=AIzaSyD5RlLc67u2SM5sIhS2VT9UwmQ_prZUIvE
    VITE_FIREBASE_AUTH_DOMAIN=kanban-board-32c01.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=kanban-board-32c01
    VITE_FIREBASE_STORAGE_BUCKET=kanban-board-32c01.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=360585500375
    VITE_FIREBASE_APP_ID=1:360585500375:web:e5216dc0350fe6a1b60292
    ```

4. **Start the Server**
   ```
   npm run dev
   ```