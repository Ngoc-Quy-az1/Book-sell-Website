import React, { useState, useRef, useEffect } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Verify from "./Verify";
import ForgotPassword from "./ForgotPassword";

const LoginPopup = ({ loginPopup, handleLoginPopup }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const loginPopupRef = useRef();
  const formRef = useRef();

  const handleEmail = (str) => {
    setEmail(str);
  }

  const handleSignUp = () => {
    setShowSignUp(true);
    setShowVerify(false);
    setForgotPassword(false);
  };

  const handleVerify = () => {
    setShowVerify(true);
    setShowSignUp(false);
    setForgotPassword(false);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
    setShowVerify(false);
    setForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
    setShowSignUp(false);
    setShowVerify(false);
  }

  // Xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginPopupRef.current && !loginPopupRef.current.contains(event.target) && 
          formRef.current && !formRef.current.contains(event.target)) {
        setForgotPassword(false);
        setShowSignUp(false);
        setShowVerify(false);
        handleLoginPopup(false);
      }
    };

    if (loginPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loginPopup, handleLoginPopup]);

  //Báo lỗi
  const [notice, setNotice] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const showNotice = () => {
    setNotice(!notice);
    setTimeout(() => {setNotice()},3000)
  }
  const handleNotice = (message, error) => {
    setMessage(message); 
    setError(error);
    showNotice();
  }

  return (
    <>
      {loginPopup && (
        <div
          ref={loginPopupRef}
          className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm"
        >
          <div 
            ref={formRef}
            className="rounded-2xl bg-white/10 backdrop-md shadow-custom-inset sm:w-[600px] md:w-[380px]"
          >
            {
              (showVerify) ? <Verify handleVerify={handleBackToLogin} mail={email} handleNotice={handleNotice} forgotPassword={forgotPassword}/>
              : (showSignUp) ? <SignUp handleSignUp={handleBackToLogin} handleVerify={handleVerify} handleMail={handleEmail} handleNotice={handleNotice}/>
              : (forgotPassword) ? <ForgotPassword handleForgotPassword={handleBackToLogin} handleNotice={handleNotice} handleVerify={handleVerify} handleMail={handleEmail}/>
              : <Login handleSignUp={handleSignUp} handleNotice={handleNotice} handleForgotPassword={handleForgotPassword}/>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPopup;
