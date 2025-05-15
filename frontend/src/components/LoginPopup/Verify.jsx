import React, { useState, useRef } from "react";
import OTPInput from "react-otp-input";
import bgVideo from './video/185096-874643413.mp4';
import { useNavigate } from "react-router-dom";
const Verify = ({ handleVerify, mail, handleNotice, forgotPassword}) => {
  const [code, setCode] = useState('');
  const formRef = useRef();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  
  const selectUrl = () => {
    if (forgotPassword) return `${apiUrl}/api/users/confirmcode`;
    return `${apiUrl}/api/users/verify?mail=${mail.mail}`;
  }

  const check = () => {
    verifyUser();
  }

  const verifyUser = () => {
    if (!code || code.length !== 6) {
      handleNotice("Please enter a valid 6-digit code", true);
      return;
    }

    const requestBody = forgotPassword ? { code, mail: mail.mail } : { ...mail, code };
    
    fetch(selectUrl(), {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return forgotPassword ? response.text() : response.json();
    })
    .then((data) => {
      if (forgotPassword) {
        if (data === "ok") {
          handleNotice("Password Successfully Changed", false);
          handleVerify();
        } else {
          handleNotice("Wrong Code", true);
        }
        return;
      }
      
      handleNotice(data.message, !data.status);
      if (data.status || data.message === 'Your account is enable! Log in now!') {
        handleVerify();
      }
    })
    .catch((error) => {
      handleNotice("An error occurred. Please try again.", true);
      console.error('Error:', error);
    });
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
      <div ref={formRef} className="w-[850px] max-w-full bg-white rounded-2xl shadow-2xl flex overflow-hidden min-h-[500px] relative">
        {/* Nút X */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 z-10"
          onClick={() => navigate("/")}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Left: Video + overlay */}
        <div className="relative w-1/2 min-h-[500px] hidden md:block">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={bgVideo}
            autoPlay
            loop
            muted
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">
              Verify Your Account
            </h2>
            <p className="text-white text-lg text-center mb-8 opacity-90">
              Please enter the OTP sent to your email.
            </p>
            <div className="mt-auto w-full flex flex-col items-center">
              <span className="text-white/80 mb-2">Already have an account?</span>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 rounded-lg shadow transition"
                onClick={handleVerify}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
        {/* Right: OTP form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-green-700 dark:text-green-400">
            Enter OTP sent to Email
          </h1>
          <div className="flex justify-center mb-6">
            <OTPInput
              value={code}
              onChange={setCode}
              numInputs={6}
              inputStyle={{
                width: '40px',
                height: '40px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                margin: '0 4px',
                fontSize: '1.25rem',
                textAlign: 'center',
                background: '#fff',
              }}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg py-2 px-8 transition mb-2" onClick={check}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
