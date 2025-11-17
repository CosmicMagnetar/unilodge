# CampusStays – AI-Powered College Accommodation Platform

campusstays:
  overview:
    problem: |
      Colleges have underutilized hostel and guesthouse rooms during vacation periods.
      Visitors such as faculty, event guests, and interns struggle to find secure
      and affordable stays near campus. Manual, paper-based booking systems lead to
      inefficiency, slow approvals, and lost revenue.

    solution: |
      CampusStays is a centralized accommodation management platform powered by AI.
      It automates booking, pricing, and communication for both guests and admins.
      It introduces an AI dynamic pricing engine and a dual-role AI Agent for
      assistance, automation, and analytics.

  system_architecture:
    frontend:
      framework: Next.js
      hosting: Vercel
      pages:
        - Home
        - Login
        - Signup
        - Dashboard
        - My Bookings

    backend:
      runtime: Node.js
      framework: Express.js
      database: MongoDB Atlas (via Mongoose ORM)
      storage: Cloudinary (images & room files)
      ai_services:
        description: "Python Flask microservice deployed on Render"
        functions:
          - dynamic_pricing
          - conversational_ai_agent

    authentication:
      library: NextAuth.js
      type: Role Based Access Control (RBAC)
      roles:
        - admin
        - guest

  features:
    authentication_and_roles: |
      Secure login system using NextAuth.js with two roles:
      Admins can create/update rooms and approve bookings.
      Guests can browse, search, and make bookings.

    room_management: |
      Admins can create, update, or remove room listings.
      Rooms include metadata such as price, amenities, type, and photos.

    booking_management: |
      Guests submit booking requests.
      Admins approve or reject bookings from their dashboard.

    search_and_dynamic_search: |
      Users can search rooms by:
        - date availability
        - type
        - price range
        - amenities
        - rating
        - room number or unique ID
      Search updates instantly (dynamic filtering).

    ai_dynamic_pricing: |
      The AI pricing engine analyzes demand, seasonality,
      and amenities to suggest optimal prices.

    ai_agent:
      description: |
        A dual-role conversational AI agent that assists both Guests and Admins.

      guest_capabilities:
        - find suitable rooms
        - answer stay-related queries
        - recommend best options
        - give check-in/checkout guidance

      admin_capabilities:
        - assist with approvals
        - summarize booking reports
        - provide analytics insights
        - automate common admin interactions

    hosting:
      frontend: Vercel
      backend: Render
      database: MongoDB Atlas
      storage: Cloudinary

  tech_stack:
    frontend:
      - Next.js
      - TailwindCSS
      - TanStack Query

    backend:
      - Node.js
      - Express.js

    database:
      - MongoDB Atlas (Mongoose ORM)

    ai_ml:
      - Python
      - Flask
      - Scikit-learn
      - OpenAI/LLM APIs (via OpenRouter or direct)

    authentication:
      - NextAuth.js (RBAC)

    storage:
      - Cloudinary

    hosting:
      - Vercel
      - Render
      - MongoDB Atlas
      - Cloudinary CDN

  api_overview:
    endpoints:
      - /api/auth/signup:
          method: POST
          description: Register a new Guest account
          access: Public

      - /api/auth/login:
          method: POST
          description: Login (Admin or Guest)
          access: Public

      - /api/rooms:
          method: GET
          description: Fetch all rooms
          access: Public

      - /api/rooms:
          method: POST
          description: Add a new room listing
          access: Admin

      - /api/rooms/{id}:
          method: PUT
          description: Update room details
          access: Admin

      - /api/search:
          method: GET
          description: Search rooms by filters, room number, or unique ID
          access: Public

      - /api/bookings:
          method: POST
          description: Create a booking request
          access: Guest

      - /api/bookings/{id}:
          method: PUT
          description: Update booking status
          access: Admin

      - /api/price-suggestion:
          method: POST
          description: Get AI-generated pricing
          access: Admin

      - /api/ai-agent/query:
          method: POST
          description: Conversational AI for guest/admin interactions
          access: Authenticated

  table_of_contents:
    - Overview
    - System Architecture
    - Key Features
    - Tech Stack
    - API Overview
