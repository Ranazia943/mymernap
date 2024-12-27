import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../authcontext/AuthContext";
import Cookies from "js-cookie"; // Import js-cookie for cookie management

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    const success = handleInputErrors(email, password);
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Ensure cookies are sent with the request
      });

      const data = await res.json();

      if (!res.ok || data.message === "Invalid email or password.") {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      console.log('Login Response:', data);

      // Save the token in cookies
      if (data.token) {
        Cookies.set("token", data.token, { expires: 7, path: "" }); // Save token in cookies
        localStorage.setItem("token", data.token); // Save token in localStorage as well
        localStorage.setItem("user", JSON.stringify(data.user)); // Save user data
      } else {
        console.error('No token found in response data');
      }

      // Save the token in context
      setAuthUser({ ...data.user, token: data.token });

      // Redirect to home page after successful login
      navigate("/");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors(email, password) {
  if (!email || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}
