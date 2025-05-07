import React, { useState } from "react";
import Swal from "sweetalert2";
import backgroundVideo from '../assets/mp.mp4';

function Password() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [tokenError, setTokenError] = useState("");

  const sendResetToken = async () => {
    setEmailError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/router/request-password-reset?email=${email}`, {
        method: "POST"
      });

      const data = await response.text();

      if (response.ok) {
        Swal.fire("Token Sent 💌", "Check your email for the reset token.", "success");
      } else {
        throw new Error(data || "Failed to send reset token.");
      }
    } catch (error) {
      console.error("Token Send Error:", error.message);
      Swal.fire("Error 💥", "Unable to send reset token. Try again.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setTokenError("");

    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!token) {
      setTokenError("Reset token is required.");
      valid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    if (password !== repassword) {
      Swal.fire("Error ⚠️", "Passwords do not match.", "warning");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch("http://localhost:8080/router/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword: password }),
      });

      const data = await response.text();

      if (response.ok) {
        Swal.fire("Success ✅", "Password reset successfully!", "success");
        setEmail("");
        setToken("");
        setPassword("");
        setRepassword("");
      } else {
        throw new Error(data || "Reset failed.");
      }
    } catch (error) {
      console.error("Reset Error:", error.message);
      Swal.fire("Error 🔥", "An error occurred. Try again.", "error");
    }
  };

  return (
    <div>
      <video className="absolute top-0 left-0 -z-10" src={backgroundVideo} loop autoPlay muted />
      <div className="flex justify-center p-10 m-10">
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-10 shadow-lg w-[400px] md:w-[450px]">

          <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-6">Reset Password</h2>
          <p className="text-center text-gray-600 mb-4 text-sm">Enter your email to receive a reset token via email.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-600"
                placeholder="Enter your email" />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}

              <button type="button" onClick={sendResetToken}
                className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-sm">
                Send Reset Token
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
              <input type="text" id="token" value={token} onChange={(e) => setToken(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-600"
                placeholder="Paste token here" />
              {tokenError && <p className="text-red-500 text-xs mt-1">{tokenError}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-600"
                placeholder="New password" />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="reenterPassword" className="block text-sm font-medium text-gray-700 mb-1">Re-enter Password</label>
              <input type="password" id="reenterPassword" value={repassword} onChange={(e) => setRepassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-600"
                placeholder="Confirm new password" />
            </div>

            <button type="submit"
              className="w-full bg-gray-800 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-600">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Password;
