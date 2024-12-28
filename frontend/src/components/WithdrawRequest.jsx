import { useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuthContext } from "../authcontext/AuthContext";  // Adjust path if necessary

const WithdrawRequest = () => {
  const { authUser } = useAuthContext();  // Get the authenticated user from context
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [gatewayAccountName, setGatewayAccountName] = useState("");
  const [gatewayAccountNumber, setGatewayAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Function to send the withdrawal request
  const withdrawRequest = async (amount, paymentMethod, gatewayAccountName, gatewayAccountNumber) => {
    // Validate inputs
    if (!amount || !paymentMethod || !gatewayAccountName || !gatewayAccountNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    // Ensure the user is authenticated
    if (!authUser || !authUser._id) {
      toast.error("User not authenticated.");
      return;
    }

    // Fetch the token (same as in the Teams component)
    const token = authUser.token || localStorage.getItem("token");

    if (!token) {
      toast.error("No token found, authorization denied.");
      return;
    }

    setLoading(true);
    try {
      // Prepare the request data
      const requestData = {
        amount,
        paymentGateway: paymentMethod,
        gatewayAccountName,
        gatewayAccountNumber,
      };

      // Log the request data (for debugging purposes)
      console.log("Sending withdrawal request with data:", requestData);

      // Send the request to the backend with token in the Authorization header
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseURL}/api/withdrawl/request/${authUser._id}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      // Log the response from the server (for debugging purposes)
      console.log("Server Response:", response.data);

      // Handle success or error
      if (response.data.message) {
        setSuccessMessage(response.data.message);
        setError('');
        toast.success(response.data.message);  // Show success message to user
      }
    } catch (err) {
      console.error("Error occurred:", err);
      setError(err.response ? err.response.data.message : "Server error");
      setSuccessMessage('');
      toast.error("Error occurred: " + (err.response ? err.response.data.message : "Server error"));
    } finally {
      setLoading(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    await withdrawRequest(amount, paymentMethod, gatewayAccountName, gatewayAccountNumber);
  };

  return (
    <div className="bg-[url('https://images.hdqwalls.com/download/dark-blur-abstract-4k-v3-1920x1080.jpg')] bg-cover bg-no-repeat min-h-screen">
      <div className="wrapper flex justify-center z-50 items-center min-h-[90vh]">
        <form
          className="max-[500px]:mx-4 mx-10 max-[500px]:w-full min-[500px]:w-[400px] md:w-[500px] backdrop-blur-lg h-auto rounded-lg border px-4 py-10"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-[800] my-4 text-center text-white">Withdraw Request</h2>

          {/* Amount Input */}
          <div className="my-4">
            <input
              type="number"
              name="amount"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              className="w-full h-10 p-2 rounded-md"
              required
            />
          </div>

          {/* Payment Method Dropdown */}
          <div className="my-8">
            <select
              name="paymentMethod"
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="shadow-md focus:border-l-4 focus:border-green-400 rounded-md outline-none shadow-green-200 w-full h-10"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="EasyPaisa">EasyPaisa</option>
              <option value="JazzCash">JazzCash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Account Name Input */}
          <div className="my-4">
            <input
              type="text"
              name="gatewayAccountName"
              id="gatewayAccountName"
              value={gatewayAccountName}
              onChange={(e) => setGatewayAccountName(e.target.value)}
              placeholder="Gateway Account Name"
              className="w-full h-10 p-2 rounded-md"
              required
            />
          </div>

          {/* Account Number Input */}
          <div className="my-4">
            <input
              type="text"
              name="gatewayAccountNumber"
              id="gatewayAccountNumber"
              value={gatewayAccountNumber}
              onChange={(e) => setGatewayAccountNumber(e.target.value)}
              placeholder="Gateway Account Number"
              className="w-full h-10 p-2 rounded-md"
              required
            />
          </div>

          {/* Error and Success Messages */}
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          {/* Submit Button */}
          <div className="text-center">
            <Button variant="contained" type="submit" sx={{ background: "#4ade80" }} disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawRequest;
