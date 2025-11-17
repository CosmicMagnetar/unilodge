CampusStays – AI-Powered Booking Platform for College Accommodations
1.	Overview
Problem: Colleges often have underused hostel or guesthouse rooms during vacations, while visitors (interns, faculty, event guests) struggle to find secure, affordable stays near campus. Manual booking systems cause inefficiency and lost revenue.
Solution: CampusStays centralizes accommodation management with AI-driven dynamic pricing and a dual-role AI Agent that assists both guests and admins.
2.	System Architecture
Frontend: Next.js app on Vercel (Home, Login, Signup, Dashboard, My Bookings).
Backend: Node.js + Express + MongoDB Atlas (via Mongoose ORM) for data and API management.
AI Services: Flask microservice on Render for dynamic pricing and a conversational AI Agent API for interaction and automation.
Auth: NextAuth.js with MongoDB for secure, role-based authentication (Admin & Guest).
Storage: Cloudinary for image and file storage.
3.	Key Features
•	Authentication & Roles: Secure login using NextAuth.js with Admin (CRUD access) and Guest (browse/book) roles.
•	Room & Booking Management: Create, update, and track room listings and booking requests.
•	Search & Dynamic Search: Search rooms by availability, filters (price, rating, type), and specific identifiers like room number or ID, with instant dynamic search results.
•	AI Dynamic Pricing: Suggests optimal pricing using demand, seasonality, and amenities.
•	AI Agent: Dual-role assistant — helps Guests find rooms, answer queries, and manage bookings, while assisting Admins with approval automation, reports, and analytics.
•	Hosting: Vercel (frontend), MongoDB Atlas (database), Render (AI microservice), Cloudinary (image storage).
4.	Tech Stack

Layer	Technologies
Frontend	Next.js, TailwindCSS, TanStack Query
Backend	Node.js, Express.js
Database	MongoDB Atlas (Mongoose ORM)
AI/ML	Python, Flask, Scikit-learn, OpenAI/LLM API
Auth	NextAuth.js (RBAC)
Storing	Cloudinary
Hosting	Vercel, Render, MongoDB Atlas, Cloudinary
5.	API Overview

Endpoint	Method	Description	Access
/api/auth/signup	POST	Register Guest	Public
/api/auth/login	POST	Login (Admin/Guest)	Public
/api/rooms	GET	Fetch rooms	Public
/api/rooms	POST	Add room	Admin
/api/rooms/:id	PUT	Update room	Admin
/api/search	GET	Search rooms (by filters, number, or ID)	Public
/api/bookings	POST	Create booking	Guest
/api/bookings/:id	PUT	Update booking	Admin
/api/price-suggestion	POST	Get AI price	Admin
/api/ai-agent/query	POST	Interact with AI Agent (Chat/Automation)	Authenticated

