import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  loginUser,
  validateToken,
  clearError,
  isAuthenticated,
} from "../../../store/slices/authSlice.js";
import { authValidateLoginForm } from "../authValidation.js";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";

export default function Login() {
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: location.state?.username || "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/gallery");
    }
  }, [loading, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    dispatch(clearError());

    const validation = authValidateLoginForm(formData);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage);
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      await dispatch(validateToken()).unwrap();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p className="auth-subtitle">
            Sign in to access your personal gallery and manage your images.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Username"
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <ErrorBanner>{validationError || error}</ErrorBanner>

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
