import React, { useState, useRef, useEffect } from "react";
import Signin from "./Signin";
import Login from "./Login";
import { motion } from "framer-motion";
import Verify from "./Verify";
import Notice from "../Notice";
import ForgotPassword from "./ForgotPassword";

const LoginPopup = ({ loginPopup, handleLoginPopup }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const handleEmail = (str) => {
    setEmail(str);
  }
  const handleSignIn = () => {
    setShowSignIn(!showSignIn);
    setShowVerify();
  };
  const handleVerify = (isSignIn) => {
    if (forgotPassword && showVerify) {
      handleForgotPassword();
    }
    setShowVerify(!showVerify);
  };
  const handleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
  }
  const loginPopupRef = useRef();

  {window.addEventListener("click", (e) => {
    if (e.target === loginPopupRef.current) {
      setShowSignIn(false);
      setShowVerify(false);
      handleLoginPopup(false);
    }
  });


// const PopupScreen = () => {
//   if (showVerify) return <Verify handleSignIn={handleSignIn} handleVerify={handleVerify} mail={email} handleNotice={handleNotice}/>
//   if (showSignIn) return <Signin handleSignIn={handleSignIn} handleVerify={handleVerify} handleMail={handleEmail} handleNotice={handleNotice}/>
//   if (forgotPassword) return <ForgotPassword handleForgotPassword={handleForgotPassword}/>
//   return <Login handleSignIn={handleSignIn} handleNotice={handleNotice} handleForgotPassword={handleForgotPassword}/>
// }
  return (
    <>
      {loginPopup && (
        <div
          ref={loginPopupRef}
          className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm"
        >
          <div className="rounded-2xl bg-white/10 backdrop-md shadow-custom-inset sm:w-[600px] md:w-[380px] ">
          
            <Notice notice={notice} message={message} showNotice={showNotice} isError={error}/>
            {
              (showVerify) ? <Verify handleSignIn={handleSignIn} handleVerify={handleVerify} mail={email} handleNotice={handleNotice} forgotPassword={forgotPassword}/>
              : (showSignIn) ? <Signin handleSignIn={handleSignIn} handleVerify={handleVerify} handleMail={handleEmail} handleNotice={handleNotice}/>
              : (forgotPassword) ? <ForgotPassword handleForgotPassword={handleForgotPassword} handleNotice={handleNotice} handleVerify={handleVerify} handleMail={handleEmail}/>
              : <Login handleSignIn={handleSignIn} handleNotice={handleNotice} handleForgotPassword={handleForgotPassword}/>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPopup;
