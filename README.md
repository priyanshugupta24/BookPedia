# Startex Backend Assignment

## Problem Statement
Develop a book management system that differentiates between users (buyers) and sellers, providing appropriate functionalities for each role. The system should allow both users and sellers to register by providing their name, email, and password, ensuring unique email addresses for registration. Implement login functionality for both users and sellers using their email and password, and manage authentication using JWT (JSON Web Tokens). Sellers should be able to upload a CSV file to add multiple books to the database, view, edit, and delete their own books, while being restricted from accessing or modifying books uploaded by other sellers, raising an error if they attempt to do so. Users should be able to log in and retrieve a list of all books in the database, and view details of specific books, but without modification rights.

## My Solution
I have developed a comprehensive solution with several key features to address the problem statement. First, I implemented JWT-based authentication and authorization, ensuring secure access control with hashed passwords to enhance security even at the database level. For handling CSV uploads, I employed data streaming to manage large files efficiently, bulk insertion for speed, and batching to prevent server overload. Additionally, I implemented a fallback mechanism that checks individual rows in the batch to ensure that errors in one row do not compromise the entire batch, providing robustness against potential server issues. I also implemented CRUD operations for sellers, ensuring that each seller can only access and modify their own data, thus maintaining data integrity and privacy. To manage the relationships between sellers and books, I established a relational structure where a seller can have many books, but each book belongs to only one seller. Furthermore, I implemented primary key and foreign key constraints so that if a seller deletes their profile, all books associated with that seller are also removed. Lastly, I enabled users to view a list of books and their details, facilitating easy access to information without modification rights.

## Tech Stack
Node JS,Express JS,PostgreSQL

# Setup
## Get Started On Your Local Computer
1. Open A Terminal On Your Local Setup and Clone the Repo to Your Local Machine
```
git clone https://github.com/priyanshugupta24/Stratex-Backend-Assignment.git
```
2. Install All Important Packages Important for the Project
```
npm install
```
3. Create a .env File for Accessing Hidden Variables
```
PORT = 5125
DATABASEPG = 'Your PSQL Database Name'
USERNAMEPG = 'Your PSQL Username'
PASSWORD = "Your PSQL Password"
HASHNO = 10
JWTSECRET = "Secret"
```
4. You are all Set with Backend , Run the Backend server<br>
    i. Before Running Please Ensure PSQL is Installed And has a Setup on Your Local Machine 
```
node server.js
```
