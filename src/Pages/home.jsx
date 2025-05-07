import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import backgroundVideo from '../assets/mp.mp4';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService.js';
import { auth } from "../Firebase.js"; // Make sure the path is correct to your firebase.js

const Home = () => {
  // Username/password ses
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { updateUser } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    setUsernameError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('Please enter a valid username.');
      valid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    }

    if (valid) {
      try {
        const response = await axios.post('http://localhost:8080/sign/login', { username, password });
        if (response.status === 200) {
          Swal.fire('Login successful!', '', 'success');
          const loginUser = await userService.getUserByUserName(username);
          updateUser(loginUser);
          navigate('/dash');
        } else {
          Swal.fire('Login failed', 'Please check your credentials.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'An error occurred.', 'error');
        console.error('Login Error:', error.response || error.message);
      }
    }
  };

  // Google Sign-In handler using Firebase client SDK
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // After successful sign in, you can access the authenticated user's info:
      const user = result.user;
      // Optionally, get an ID token if you need to pass it to your backend for verification
      const idToken = await user.getIdToken();
      console.log('Google Sign-In successful:', user);
      console.log('ID Token:', idToken);
      Swal.fire('Google Sign-In successful!', '', 'success');
      navigate('/dash');
    } catch (error) {
      Swal.fire('Error', error.message || 'Google Sign-In failed', 'error');
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <div>
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src={backgroundVideo}
        autoPlay
        loop
        muted
      />

      {/* Flex Container */}
      <div className="flex justify-center p-12 items-center">
        <div className="relative flex p-10">
          {/* Left Pane */}
          <div className="flex flex-col justify-center items-center p-8 text-white">
            <h1 className="text-5xl font-bold mb-6">Welcome to Skill-Sync</h1>
            <p className="text-lg text-center leading-relaxed max-w-md">
              Discover, share your skills and grow your knowledge with Skill-Sync.
            </p>
          </div>

          {/* Right Pane */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-10 shadow-lg w-[400px] md:w-[450px] m-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-800">Login to Your Account</h2>
              <p className="text-gray-500 mt-2">Access your dashboard and manage tasks effortlessly.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter your username"
                />
                {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter your password"
                />
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
              >
                Sign in
              </button>
            </form>

            {/* Google Sign-In Button */}
            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
              >
                Sign in with Google
              </button>
            </div>

            <p className="text-center text-sm text-black mt-6">
              Not a member?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition"
              >
                Create Account
              </Link>
            </p>
            <p className="text-center text-sm text-black mt-6">
              Forgot your password?{' '}
              <Link
                to="/password"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition"
              >
                Get My Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
