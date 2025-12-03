Teams-Mind
Team Collaboration & Messaging Application

This is a web application built using Next.js that allows users to sign up, login, and interact with team members through public and private messages. The application uses Tailwind CSS for styling and Supabase as the database and authentication backend.

Features
User Authentication: New users can sign up, and existing users can log in.
Dashboard: After login, users are redirected to a dashboard displaying:
Username
Team name
Sign out button
Messaging System:
Users can post messages as Public or Private.
Public messages: visible to all users of the application.
Private messages: visible only to members of the same team.
Users can like and comment on messages.
Comments display as Anonymous (user names are hidden).
Setup & Run Instructions
Install dependencies:

npm install

Run the development server: npm run dev Open your browser and navigate to http://localhost:3000

Currently this application live on: https://teams-mind.netlify.app/ Architecture Overview Next.js Server Actions: The application uses Next.js Server Actions to handle backend operations like:

User authentication (sign up, login, logout)

Message creation, fetching, and deletion

Comment and like handling

Pages Structure:

/signup – user registration page

/login – user login page

/dashboard – main user dashboard with messaging functionalities

Components:

MessageCard – displays individual messages with likes and comments

CommentSection – handles comments on messages

Navbar – shows username, team name, and sign out button

Database (Supabase):

Tables:

users – stores user details and team association

messages – stores message content, type (public/private), author, and timestamps

comments – stores comments on messages anonymously

likes – stores likes associated with messages

Access Control Logic Message Visibility:

Public messages are visible to all users.

Private messages are visible only to users in the same team as the message author.

Comments:

Users can comment on any visible message.

Comment authors are shown as "Unknown" to maintain anonymity.

Server Actions enforce these rules before returning any data to the client.

Reflection The most challenging feature to implement was Access Control for private messages and anonymous comments. Ensuring that users only see messages for their team while still being able to like and comment anonymously required careful handling of Supabase queries and Server Actions.

Tech Stack Frontend: Next.js, Tailwind CSS

Backend / Database: Supabase (Authentication + PostgreSQL)

Hosting: Netlify
