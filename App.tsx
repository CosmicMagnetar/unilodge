import React, { useState, useEffect } from "react";
import { User, Role, Room, Booking } from "./types.ts";
import { api } from "./services/api.ts";
import  Header  from "./pages/Header.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { GuestDashboard } from "./pages/GuestDashboard.tsx";
import {AdminDashboard} from "./pages/AdminDashboard.tsx";
import { MyBookingsPage } from "./pages/MyBookingsPage.tsx";
import { WardenDashboard } from "./pages/WardenDashboard.tsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState("home");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .getMe()
        .then((user) => {
          setCurrentUser(user);
          // set page based on role (handle WARDEN in caps)
          if (user.role === Role.ADMIN) setPage("admin-dashboard");
          else if (user.role === Role.WARDEN) setPage("warden-dashboard");
          else setPage("guest-dashboard");
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
    loadRooms();
  }, []);

  // Load bookings when user is logged in
  useEffect(() => {
    if (currentUser) {
      loadBookings();
    }
  }, [currentUser]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(
        data.map((r: any) => ({
          id: r._id || r.id,
          roomNumber: r.roomNumber,
          type: r.type,
          price: r.price,
          amenities: r.amenities || [],
          rating: r.rating || 0,
          imageUrl: r.imageUrl,
          isAvailable: r.isAvailable,
          description: r.description,
          capacity: r.capacity,
        }))
      );
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setBookingLoading(true);
      const data = await api.getBookings();
      setBookings(
        data.map((b: any) => ({
          id: b.id || b._id,
          roomId: typeof b.roomId === "object" ? b.roomId._id : b.roomId,
          userId: typeof b.userId === "object" ? b.userId._id : b.userId,
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
          status: b.status,
          totalPrice: b.totalPrice,
          room: b.room || b.roomId,
        }))
      );
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await api.login(email, password);
    localStorage.setItem("token", response.token);
    setCurrentUser(response.user);
    // set page based on role (support WARDEN)
    if (response.user.role === Role.ADMIN) setPage("admin-dashboard");
    else if (response.user.role === Role.WARDEN) setPage("warden-dashboard");
    else setPage("guest-dashboard");
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await api.signup(name, email, password);
    localStorage.setItem("token", response.token);
    setCurrentUser(response.user);
    setPage("guest-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setPage("home");
  };

  const handleNavigate = (newPage: string) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleBook = async (roomId: string) => {
    if (!currentUser) {
      setPage("login");
      return;
    }
    if (currentUser.role === Role.ADMIN) {
      alert("Admins cannot book rooms.");
      return;
    }

    const checkIn = prompt("Enter check-in date (YYYY-MM-DD):");
    const checkOut = prompt("Enter check-out date (YYYY-MM-DD):");

    if (!checkIn || !checkOut) return;

    try {
      await api.createBooking(roomId, checkIn, checkOut);
      alert("Booking created successfully!");
      loadBookings();
      loadRooms();
    } catch (error: any) {
      alert(error.message || "Failed to create booking");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.updateBookingStatus(bookingId, "Cancelled");
      loadBookings();
      loadRooms();
    } catch (error: any) {
      alert(error.message || "Failed to cancel booking");
    }
  };

  const renderPage = () => {
    switch (page) {
      case "login":
        return <LoginPage onLogin={handleLogin} onSignup={handleSignup} />;
      case "guest-dashboard":
        return (
          currentUser && (
            <GuestDashboard
              user={currentUser}
              rooms={rooms}
              onBook={handleBook}
            />
          )
        );
      case "admin-dashboard":
        return (
          currentUser && (
            <AdminDashboard
              user={currentUser}
              rooms={rooms}
              bookings={bookings}
            />
          )
        );
      case "warden-dashboard":
        return (
          currentUser && (
            <WardenDashboard
              user={currentUser}
              rooms={rooms}
              bookings={bookings}
            />
          )
        );
      case "my-bookings":
        return (
          <MyBookingsPage bookings={bookings} onCancel={handleCancelBooking} />
        );
      case "home":
      default:
        // HomePage no longer needs props passed to it
        return <HomePage />;
    }
  };

  return (
    // The old code used bg-light-bg. The new homepage uses bg-gray-50.
    // I'll set the default to white, as the new header is white.
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        user={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main className="flex-grow">{renderPage()}</main>
      {/* This footer is from the old code and doesn't match the new UI's bottom nav */}
      {/* You may want to replace this with the "About Us, FAQ, Safety" links */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} CampusConnect Rooms. All rights
            reserved.
          </p>
          <p className="mt-2">Your Trusted Partner in Campus Accommodations.</p>
        </div>
      </footer>
    </div>
  );
}
