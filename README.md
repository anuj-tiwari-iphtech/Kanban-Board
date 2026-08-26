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
3. **Start the Server**
   ```
   npm run dev
   ```