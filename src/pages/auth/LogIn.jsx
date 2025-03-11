import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError({});

    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await login(email, password);
      } catch (error) {
        if (error.response) {
          const errorMessages = error.response?.data?.errors || [
            "An unknown error occurred",
          ];
          setError({ server: errorMessages.join(", ") });
        } else {
          setError({ server: "An error occurred. Please try again." });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded-md bg-white outline-none"
            />
            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded-md bg-white outline-none"
            />
            {error.password && (
              <p className="text-red-500 text-sm">{error.password}</p>
            )}
          </div>
          {error.server && (
            <p className="text-red-500 text-sm mt-2">{error.server}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {`Don't have an account?`}{" "}
          <a href="/signup" className="text-blue-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
