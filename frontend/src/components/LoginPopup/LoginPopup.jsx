import React, { useState, useRef, useEffect } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Verify from "./Verify";
import Notice from "../ErrorNotice";
import ForgotPassword from "./ForgotPassword";

const LoginPopup = ({ loginPopup, handleLoginPopup }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const loginPopupRef = useRef();

  const handleEmail = (str) => {
    setEmail(str);
  };

  const handleSignUp = () => {
    setShowSignUp(true);
    setShowVerify(false);
    setForgotPassword(false);
  };

  const handleVerify = () => {
    setShowVerify(true);
    setShowSignUp(false);
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
    setShowSignUp(false);
    setShowVerify(false);
  };

  const resetStates = () => {
    setForgotPassword(false);
    setShowSignUp(false);
    setShowVerify(false);
    handleLoginPopup(false);
  };

  const backToLogin = () => {
    setForgotPassword(false);
    setShowSignUp(false);
    setShowVerify(false);
  };

  const [notice, setNotice] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const showNotice = () => {
    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  const handleNotice = (msg, isError) => {
    setMessage(msg);
    setError(isError);
    showNotice();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginPopupRef.current && loginPopupRef.current === event.target) {
        resetStates();
      }
    };
    if (loginPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loginPopup, handleLoginPopup]);

  return (
    <>
      <Notice notice={notice} message={message} showNotice={showNotice} isError={error} />
      {loginPopup && (
        <div
          ref={loginPopupRef}
          className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm flex justify-center items-center"
        >
          <div className="rounded-2xl bg-white/10 backdrop-md shadow-custom-inset sm:w-[600px] md:w-[380px]">
            {
              showVerify ? (
                <Verify resetStates={resetStates} backToLogin={backToLogin} mail={email} handleNotice={handleNotice} forgotPassword={forgotPassword} />
              ) : showSignUp ? (
                <SignUp resetStates={resetStates} backToLogin={backToLogin} handleSignUp={handleSignUp} handleVerify={handleVerify} handleMail={handleEmail} handleNotice={handleNotice} />
              ) : forgotPassword ? (
                <ForgotPassword resetStates={resetStates} backToLogin={backToLogin} handleForgotPassword={handleForgotPassword} handleNotice={handleNotice} handleVerify={handleVerify} handleMail={handleEmail} />
              ) : (
                <Login resetStates={resetStates} handleSignUp={handleSignUp} handleNotice={handleNotice} handleForgotPassword={handleForgotPassword} />
              )
            }
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPopup;
