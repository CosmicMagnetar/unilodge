# CampusStays – AI-Powered Booking Platform for College Accommodations

## 1. Overview

**Problem:**  
Colleges often have underused hostel or guesthouse rooms during vacations, while visitors (interns, faculty, event guests) struggle to find secure, affordable stays near campus. Manual booking systems cause inefficiency and lost revenue.

**Solution:**  
CampusStays centralizes accommodation management with AI-driven dynamic pricing and a dual-role AI Agent that assists both guests and admins.

---

## 2. System Architecture

- **Frontend:** Next.js app on Vercel (Home, Login, Signup, Dashboard, My Bookings)  
- **Backend:** Node.js + Express + MongoDB Atlas (via Mongoose ORM)  
- **AI Services:** Flask microservice on Render  
  - Dynamic pricing  
  - Conversational AI Agent  
- **Auth:** NextAuth.js with MongoDB (Admin & Guest roles)  
- **Storage:** Cloudinary for image/file uploads  

---

## 3. Key Features

- **Authentication & Roles:**  
  Secure login using NextAuth.js with Admin (CRUD access) and Guest (browse/book) roles.

- **Room & Booking Management:**  
  Create, update, and track room listings and booking requests.

- **Search & Dynamic Search:**  
  Filter rooms by availability, price, rating, type, or search directly by room number/ID.

- **AI Dynamic Pricing:**  
  Suggests optimal pricing using demand, seasonality, and amenities.

- **AI Agent:**  
  Dual-role assistant that helps guests find rooms, answer queries, and manage bookings, while assisting admins with approvals, reports, and analytics.

- **Hosting:**  
  Vercel (frontend), MongoDB Atlas (database), Render (AI microservice), Cloudinary (image storage).

---

## 4. Tech Stack

### **Tech Stack Table**

| Layer       | Technologies                               |
|-------------|---------------------------------------------|
| Frontend    | Next.js, TailwindCSS, TanStack Query        |
| Backend     | Node.js, Express.js                         |
| Database    | MongoDB Atlas (Mongoose ORM)                |
| AI/ML       | Python, Flask, Scikit-learn, OpenAI/LLM API |
| Auth        | NextAuth.js (RBAC)                          |
| Storage     | Cloudinary                                  |
| Hosting     | Vercel, Render, MongoDB Atlas, Cloudinary   |

---

## 5. API Overview

### **API Endpoints Table**

| Endpoint              | Method | Description                                         | Access        |
|-----------------------|--------|-----------------------------------------------------|---------------|
| /api/auth/signup      | POST   | Register Guest                                      | Public        |
| /api/auth/login       | POST   | Login (Admin/Guest)                                 | Public        |
| /api/rooms            | GET    | Fetch rooms                                         | Public        |
| /api/rooms            | POST   | Add room                                            | Admin         |
| /api/rooms/:id        | PUT    | Update room                                         | Admin         |
| /api/search           | GET    | Search rooms by filters, number, or ID              | Public        |
| /api/bookings         | POST   | Create booking                                      | Guest         |
| /api/bookings/:id     | PUT    | Update booking                                      | Admin         |
| /api/price-suggestion | POST   | Get AI price suggestion                             | Admin         |
| /api/ai-agent/query   | POST   | Interact with AI Agent (Chat/Automation)            | Authenticated |

---

## Table of Contents

1. Overview  
2. System Architecture  
3. Key Features  
4. Tech Stack  
5. API Overview
