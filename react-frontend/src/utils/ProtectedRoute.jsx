import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { isAuthenticated } from "../store/slices/authSlice";

export default function ProtectedRoute({ children }) {
  const authLoading = useSelector((state) => state.auth.loading);
  const authenticated = isAuthenticated();

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
