# SmashConnect

**SmashConnect** is a web application designed to unify and enhance the experience of the Malaysian badminton community. By providing a user-centered platform, it aims to address the fragmented nature of the community and promote social connections, physical activity, and community engagement aligned with **Sustainable Development Goal 3 (SDG 3)** for good health and well-being.

---

## Project Overview

### Abstract
SmashConnect is built to connect Malaysian badminton enthusiasts in a centralized platform that fosters connectivity, social interaction, and health promotion. Through features such as user engagement, matchmaking, event management, and court/equipment locators, SmashConnect creates an interactive and supportive ecosystem for badminton players. By aligning with SDG 3, the platform encourages physical and social engagement, empowering users to thrive on and off the court.

---

## System Architecture
![SystemArchitecture](https://github.com/user-attachments/assets/ff64b3ef-e410-4e81-ac2e-de55f63ced7d)

### Frontend
- **Next.js**: Hybrid rendering, file-based routing, and code splitting.
- **React**: Core library for dynamic and interactive interfaces.
- **Auth.js**: User authentication management.
- **React Hook Form**: Form validation and submission handling.
- **Zod**: Form data validation for data integrity.
- **Tailwind CSS**: Styling for consistent and responsive design.
- **Apollo Client**: State management and GraphQL API interactions.
- **Radix UI & Shadcn UI**: Customizable and accessible UI components.
- **Lucide React**: SVG icon library for scalable icons.
- **Sharp**: Image optimization for faster load times.
- **Socket.IO Client**: Real-time communication between the client and server.

### API
- **GraphQL**: Enables efficient data fetching, allowing clients to request only the necessary data in a single query.

### External API
- **Google Maps API**: Provides geolocation services for court and event location features.

### Backend
- **Express.js**: Server-side logic management.
- **Node.js**: Backend runtime environment.
- **JSON Web Token (JWT)**: User authentication.
- **Socket.IO**: Real-time, bidirectional communication.
- **Bcrypt**: Password hashing for secure storage.
- **Puppeteer**: Web scraping and automation.
- **Cheerio**: HTML parsing and manipulation for web scraping.
- **Mongoose**: MongoDB Object Data Modeling (ODM).

### Database
- **MongoDB**: NoSQL database for flexible and scalable data storage.

---

## Features

1. **User Authentication**
   - **Login**, **Logout**, and **Register** for secure access.

2. **Profile Management**
   - Update and customize your user profile.

3. **Social Connectivity**
   - Send and manage friend requests, and chat in real time with friends.

4. **Game Buddy Matchmaking**
   - Find players based on skill, location, playing style, and availability.

5. **Event Management Hub**
   - Join, leave, and manage badminton events.

6. **Court Locator**
   - Discover nearby courts, view details, and read/write reviews.

7. **Equipment Hub**
   - Find and review equipment, and search by type, brand, and price.

8. **Personal Reviews**
   - View, search, and manage reviews shared with the community.

9. **Centralized Dashboard & Notifications**
   - Access all features in a single dashboard with real-time notifications.

---
