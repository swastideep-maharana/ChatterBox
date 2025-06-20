import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect, useState } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const [showWakeMessage, setShowWakeMessage] = useState(false);

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show a 'Waking up server...' message if loading takes longer than 2s
  useEffect(() => {
    let timer;
    if (isCheckingAuth && !authUser) {
      timer = setTimeout(() => setShowWakeMessage(true), 2000);
    } else {
      setShowWakeMessage(false);
    }
    return () => clearTimeout(timer);
  }, [isCheckingAuth, authUser]);

  console.log({ authUser });

  return (
    <div data-theme={theme}>
      <Navbar />
      <div className="pt-16 min-h-screen flex flex-col">
        {isCheckingAuth && !authUser ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader className="size-10 animate-spin" />
              {showWakeMessage && (
                <span className="text-sm text-zinc-500">
                  Waking up server, please wait...
                </span>
              )}
            </div>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
        )}
      </div>
      <Toaster />
    </div>
  );
};
export default App;
