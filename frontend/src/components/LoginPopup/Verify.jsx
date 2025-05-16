import React, { useState, useRef, useEffect } from "react";
import OTPInput from "react-otp-input";
import bgVideo from './video/185096-874643413.mp4';
import { useNavigate } from "react-router-dom";

const Verify = ({ resetStates, backToLogin, mail, handleNotice, forgotPassword }) => {
  const [code, setCode] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });
  const formRef = useRef();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const showNotification = (message, isError = false) => {
    setNotification({ show: true, message, isError });
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification({ show: false, message: '', isError: false });
    }, 3000);
  };

  const selectUrl = () => {
    return forgotPassword
      ? `${apiUrl}/api/users/confirmcode`
      : `${apiUrl}/api/users/verify?mail=${mail.mail}`;
  };

  const check = () => {
    if (!code || code.length !== 6) {
      showNotification("Please enter a valid 6-digit code", true);
      return;
    }
    verifyUser();
  };

  const verifyUser = () => {
    const requestBody = forgotPassword
      ? { 
          infor: mail.infor,
          password: mail.password,
          code: code 
        }
      : { ...mail, code };

    fetch(selectUrl(), {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Network error');
        }
        return forgotPassword ? response.text() : response.json();
      })
      .then((data) => {
        if (forgotPassword) {
          if (data === "ok") {
            showNotification("Password Successfully Changed", false);
            setTimeout(() => {
              backToLogin();
            }, 1500);
          } else {
            showNotification("Wrong Code", true);
          }
        } else {
          if (data.status || data.message === 'Your account is enable! Log in now!') {
            showNotification(data.message, false);
            setTimeout(() => {
              backToLogin();
            }, 1500);
          } else {
            showNotification(data.message, true);
          }
        }
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        showNotification(error.message || "An error occurred. Please try again.", true);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
      <div ref={formRef} className="w-[850px] max-w-full bg-white rounded-2xl shadow-2xl flex overflow-hidden min-h-[500px] relative">
        {/* Nút X */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 z-10"
          onClick={resetStates}
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
                onClick={backToLogin}
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
          {/* Notification */}
          {notification.show && (
            <div className={`w-full mb-4 p-3 rounded-lg text-center ${
              notification.isError 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {notification.message}
            </div>
          )}
          <div className="flex justify-center mb-6">
            <OTPInput
              value={code}
              onChange={setCode}
              numInputs={6}
              inputStyle={{
                width: '40px',
                height: '40px',
                border: isDark ? '1px solid rgba(255,255,255,0.23)' : '1px solid rgba(0,0,0,0.23)',
                borderRadius: '8px',
                margin: '0 4px',
                fontSize: '1.25rem',
                textAlign: 'center',
                background: 'transparent',
                color: isDark ? '#e5e7eb' : '#111827',
                transition: 'all 0.2s ease-in-out',
              }}
              containerStyle={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  className={isDark ? 'dark:border-gray-600 dark:bg-transparent dark:text-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30' : ''}
                />
              )}
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg py-2 px-8 transition mb-2"
            onClick={check}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
