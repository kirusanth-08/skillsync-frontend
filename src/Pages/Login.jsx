import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Swal from 'sweetalert2';
import backgroundVideo from '../assets/mp.mp4';

function Login() {
  const [fst, setFirst] = useState('');
  const [lst, setLast] = useState('');
  const [eml, setEmail] = useState('');
  const [user, setUserName] = useState('');
  const [pwd, setPassword] = useState('');
  const [pwdr, setRePassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repasswordError, setRePasswordError] = useState('');

  const encrypt = (data) => {
    const key = 'sadu@123';  // Encryption key used for password encryption
    return CryptoJS.AES.encrypt(data, key).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const encryptedPassword = encrypt(pwd);
    let valid = true;
  
    // Reset error messages
    setEmailError('');
    setPasswordError('');
    setRePasswordError('');
  
    // Email validation
    if (!eml || !/\S+@\S+\.\S+/.test(eml)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
  
    // Password validation
    if (!pwd || pwd.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    }
  
    // Re-entered Password validation
    if (!pwdr || pwd !== pwdr) {
      setRePasswordError('Re-entered password does not match.');
      valid = false;
    }
  
    // If the form is invalid, stop here
    if (!valid) return;
  
    // API call to register the user
    try {
      const response = await axios.post('http://localhost:8080/sign/register', {
        username: user,
        email: eml,
        password: encryptedPassword,
        firstName: fst,
        lastName: lst,
        // Use the same key as in the Java model: resetPassword
        resetPassword: pwdr
      });
  
      // Assuming your backend sends a 201 CREATED for successful registration
      if (response.status === 201) {
        Swal.fire('Registration successful!');
        // Redirect to the login page (or home page) after successful registration
        window.location.href = "/";
      }
    } catch (error) {
      Swal.fire(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <div>
      <video className="absolute top-0 left-0 w-full h-full object-cover -z-10" src={backgroundVideo} loop muted autoPlay />
      <div className="flex justify-center justify-items-center p-10">
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-10 shadow-lg w-[400px] md:w-[450px] m-10">
          <h2 className="text-3xl font-semibold text-white text-center mb-6">Create an Account</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm">First Name</label>
                <input
                  type="text"
                  value={fst}
                  onChange={(e) => setFirst(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-white/30 border border-white/40 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="text-white text-sm">Last Name</label>
                <input
                  type="text"
                  value={lst}
                  onChange={(e) => setLast(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-white/30 border border-white/40 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-white text-sm">Email</label>
              <input
                type="text"
                value={eml}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white/30 border border-white/40 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                required
              />
              {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
            </div>
            <div>
              <label className="text-white text-sm">Username</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white/30 border border-white/40 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                required
              />
            </div>
            <div>
              <label className="text-white text-sm">Password</label>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white/30 border border-white/40 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                required
              />
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
            </div>
            <div>
              <label className="text-white text-sm">Re-Enter Password</label>
              <input
                type="password"
                value={pwdr}
                onChange={(e) => setRePassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white/30 border border-white/40 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                required
              />
              {repasswordError && <p className="text-red-400 text-sm">{repasswordError}</p>}
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-md shadow-lg hover:scale-105 transition duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-center text-white">
            Already have an account?{' '}
            <a href="http://localhost:5173/home" className="text-blue-300 hover:text-blue-200 font-medium">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
