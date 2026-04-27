# Software Requirements Specification (SRS) for CodeVault

## 1. Introduction
### 1.1 Purpose
The purpose of this document is to outline the software requirements for **CodeVault**, a full-stack web application designed for developers to manage and store code snippets with syntax highlighting.
### 1.2 Scope
CodeVault allows users to securely register and log in to a centralized platform where they can create, read, update, and delete (CRUD) their specialized code snippets. The snippet manager features premium styling and a dynamic, fluid user interface utilizing Vanilla HTML, CSS, and JavaScript.
### 1.3 Definitions and Acronyms
- **JWT**: JSON Web Token, used for secure authentication.
- **REST**: Representational State Transfer, architecture for the backend API.
- **CRUD**: Create, Read, Update, Delete.
- **UI**: User Interface.

## 2. Overall Description
### 2.1 Product Perspective
CodeVault is a standalone web application featuring a Node.js/Express.js RESTful API as the Backend, MongoDB as the persistent data store, and Vanilla static files for the Frontend UI.
### 2.2 Product Functions
- **User Authentication**: Register new accounts and log in. Token-based session management.
- **Snippet Management**: Users can create new snippets specifying a title, programming language, and code content.
- **Dashboard**: Display a user's snippets with search and filtering capabilities.
- **Editing**: Users can modify or delete existing snippets.
- **Syntax Highlighting**: Real-time syntax visualization utilizing Prism.js.
### 2.3 User Classes and Characteristics
- **Developers / Programmers**: Primary users seeking to store code blocks, reference fragments, or functions securely in an organized space.

## 3. Specific Requirements
### 3.1 External Interface Requirements
#### 3.1.1 User Interfaces
- **Authentication Views (`index.html`, `register.html`)**: Interactive glassmorphism-styled forms for secure authentication.
- **Dashboard View (`dashboard.html`)**: A robust UI featuring a master list of created snippets. Includes a search bar to instantly query titles.
- **Editor / Workspace View (`editor.html`)**: A workspace view displaying syntax-highlighted code. Provides mechanisms for code editing, saving, and deletion.
#### 3.1.2 Software Interfaces
- **Prism.js**: Integrated via CDN to parse code syntax and apply styling dynamically on the frontend.
- **MongoDB Atlas**: Cloud-hosted NoSQL database used to store User and Snippet schemas.
- **Mongoose**: ODM (Object Data Modeling) library connecting Node/Express to MongoDB.

### 3.2 Functional Requirements
- **FR1 - Registration**: The system must allow users to create an account by supplying a username/email and password.
- **FR2 - Login**: The system must authenticate user credentials against the database and issue a JWT token.
- **FR3 - Token Verification**: All snippet-oriented API endpoints must verify the validity of the JWT token before executing any database operations.
- **FR4 - Create Snippet**: The system must allow authenticated users to save a new code fragment.
- **FR5 - Read Snippet**: The system must fetch all snippets tied to an authenticated user's ID.
- **FR6 - Update Snippet**: The system must allow modifications to existing snippets owned by the requested user.
- **FR7 - Delete Snippet**: The system must securely purge a specific snippet by its document ID.
- **FR8 - Search / Filtering**: The User Interface must filter the retrieved snippets based on a title keyword query natively.

### 3.3 Non-Functional Requirements
- **Performance**: The application API should respond to database queries efficiently, aiming for low latency response times.
- **Security**: User passwords must be irrevocably hashed via `bcrypt(js)` before storage in the database. Sessions are restricted via stateless JWT mechanisms (Local Storage/Headers).
- **Usability**: Priority is set on high-fidelity user aesthetics, highlighting vibrant custom configurations over standard UI frameworks.
- **Reliability / Zero-Build Environment**: The frontend completely relies on native browser interpretation. There are no heavy compilation build steps using Webpack or similar tools.

## 4. System Models and Route Design
### 4.1 Database Schemas
- **User Schema**: Includes `username` (or email) and `password`.
- **Snippet Schema**: Includes `title`, `language`, `code`, and author references (`userId`).
### 4.2 API Endpoints
#### User & Authentication (`/api/auth/...`)
- `POST /register`: Registers a new user, hashes password, saves configuration to DB.
- `POST /login`: Validates the plaintext password against the hashed state and issues a JWT token.
#### Snippets (`/api/snippets/...`)
- `GET /`: Retrieves all snippets associated with the respective authenticated user.
- `POST /`: Saves a new snippet model mapped to the user.
- `PUT /:id`: Replaces or updates fields on a specifically targeted snippet document.
- `DELETE /:id`: Safely erases an existing targeted snippet document from the data store.
