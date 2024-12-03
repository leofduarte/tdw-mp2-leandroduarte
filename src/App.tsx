import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { setUser } from "./slices/authSlice";
import supabase from "./config/supabase-client";
import ProtectedRoute from "./components/protectedRoute";
import Login from "./pages/auth/Login";
import Homepage from "./pages/Homepage";
import StoriesList from "./pages/stories/StoriesList";
import StoryDetail from "./pages/stories/StoryDetail";
import StoryCreate from "./pages/stories/StoryCreate";
import Logout from "./pages/auth/Logout";
import StoryInterface from "./pages/stories/StoryInterface";
import Error404 from "./pages/error404";
import PublicRoute from "./components/publicRoute";
import AboutUs from "./pages/AboutUs";
import Signup from "./pages/auth/SignUp";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setUser(session?.user ?? null));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route 
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/about-us"
          element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories"
          element={
            <ProtectedRoute>
              <StoriesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories/flow/:slug"
          element={
            <ProtectedRoute>
              <StoryDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-story"
          element={
            <ProtectedRoute>
              <StoryCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Error404 />} />

        <Route
          path="/stories/quiz/:slug"
          element={
            <ProtectedRoute>
              <StoryInterface />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
