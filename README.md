# MeetYourBand 🎸

A full-stack social media platform for musicians to find bandmates, collaborate, and share their work.

---

### Live Demo & Features

![MeetYourBand Live Demo](https://qrswqbfuolwuqvfsonia.supabase.co/storage/v1/object/public/asset//djembaraa%20web%20gif2.gif)

<details>
<summary><strong>Click to see more features in action</strong></summary>
  
| Feature | Demo |
|---|---|
| **User Profile & Post Feed** | ![User Profile Feed](https://qrswqbfuolwuqvfsonia.supabase.co/storage/v1/object/public/asset//djembaraa%20web%20gif6.gif) |
| **Google & Standard Login** | ![Authentication Flow](https://qrswqbfuolwuqvfsonia.supabase.co/storage/v1/object/public/asset//djembaraa%20web%20gif.gif) |
| **Create & Upload Media** | ![Create Post with Media](https://qrswqbfuolwuqvfsonia.supabase.co/storage/v1/object/public/asset//djembaraa%20web%20gif2.gif) |
| **Like & Comment Interaction** | ![Like and Comment](https://qrswqbfuolwuqvfsonia.supabase.co/storage/v1/object/public/asset//djembaraa%20web%20gif3.gif) |
| **Edit & Delete Posts** | ![Edit and Delete](https://qrswqbfuolwuqvfsonia.supabase.co/storage/v1/object/public/asset//djembaraa%20web%20gif4.gif) |

</details>

---

### Description

**MeetYourBand** is a full-stack web application designed to be a bridge for musicians. Whether you are a guitarist looking for a drummer, a vocalist in need of a band, or a producer searching for new talent, this platform provides all the tools you need to connect, discuss, and collaborate in the world of music.

This project was built from the ground up to demonstrate a deep understanding of modern web application architecture, from database design and backend API development to creating a responsive and interactive frontend interface.

---

### Key Features

-   **Complete Authentication:**
    -   Standard Registration and Login with email & password.
    -   Secure password hashing using `bcryptjs`.
    -   Modern authentication with **Login via Google (OAuth 2.0)**.
    -   Protected routes using **JWT (JSON Web Token)**.
-   **Dynamic Social Feed:**
    -   Users can create posts containing text, images, or videos.
    -   A main feed that displays all posts, sorted by the newest.
    -   Instant UI updates when a new post is created.
-   **Full Post Management (CRUD):**
    -   Users can **Create**, **Read**, **Update**, and **Delete** their own posts.
    -   Authorization system to ensure only the post owner can edit or delete.
-   **Social Interaction:**
    -   **Like/Unlike** feature on every post.
    -   **Commenting** system under each post.
-   **Comprehensive User Profiles:**
    -   Dynamic profile pages for each user.
    -   Ability to upload and change profile pictures.
    -   Features to edit bio, instruments, and current status.
    -   A dedicated feed displaying all posts from a specific user.

---

### Tech Stack

#### Backend
-   **[Node.js](https://nodejs.org/)**: JavaScript runtime environment.
-   **[Express.js](https://expressjs.com/)**: Framework for building the API.
-   **[PostgreSQL](https://www.postgresql.org/)**: Relational database system.
-   **[Passport.js](https://www.passportjs.org/)**: Authentication middleware (specifically for Google OAuth).
-   **[JSON Web Token](https://jwt.io/)**: For secure API authorization.
-   **[Bcrypt.js](https://www.npmjs.com/package/bcryptjs)**: For password hashing.
-   **[Multer](https://www.npmjs.com/package/multer)**: For handling file uploads.

#### Frontend
-   **[React.js](https://react.dev/)**: Library for building user interfaces.
-   **[Vite](https://vitejs.dev/)**: Modern and fast frontend build tool.
-   **[React Router](https://reactrouter.com/)**: For client-side navigation and routing.
-   **[Tailwind CSS](https://tailwindcss.com/)**: CSS framework for rapid styling.
-   **[Axios](https://axios-http.com/)**: HTTP client for communicating with the backend API.
-   **[React Context API](https://react.dev/reference/react/useContext)**: For global state management (login status).

---

### How to Run Locally

To run this project on your local machine, follow these steps:

#### 1. Prerequisites
-   Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).
-   Ensure you have [PostgreSQL](https://www.postgresql.org/download/) installed and running.
-   Create a new database in PostgreSQL named `meetyourband`.
-   Run all the SQL commands in the `database.sql` file (if provided) to set up the tables.

#### 2. Installation
1.  **Clone this repository:**
    ```bash
    git clone [https://github.com/djembaraa/meetyourband.git](https://github.com/djembaraa/meetyourband.git)
    cd meetyourband
    ```
2.  **Set up the `.env` file:**
    -   In the root project folder, create a file named `.env`.
    -   Fill it with the following variables, replacing the values with your own configuration:
        ```env
        DB_USER=postgres
        DB_PASSWORD=your_db_password
        DB_HOST=localhost
        DB_PORT=5432
        DB_DATABASE=meetyourband
        JWT_SECRET=your_jwt_secret_key
        SESSION_SECRET=your_session_secret_key
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=your_google_client_secret
        ```
3.  **Install Backend dependencies:**
    *(From the root folder)*
    ```bash
    npm install
    ```
4.  **Install Frontend dependencies:**
    ```bash
    cd client
    npm install
    ```

#### 3. Running the Application
-   Go back to the root folder (`meetyourband`), then run:
    ```bash
    npm run dev
    ```
-   The frontend application will be running at `http://localhost:5173`.
-   The backend server will be running at `http://localhost:3000`.

---
### Contact
Djembar Arafat – [LinkedIn](https://www.linkedin.com/in/djembar-arafat-9a6602178/) – [djembararafat98@gmail.com](mailto:djembararafat98@gmail.com)

Project Source Code: [https://github.com/djembaraa/meetyourband](https://github.com/djembaraa/meetyourband)
