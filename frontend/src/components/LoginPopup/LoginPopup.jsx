import React, { useState, useRef, useEffect } from "react";
import Signin from "./Signin";
import Login from "./Login";
import { motion } from "framer-motion";
import Verify from "./Verify";

const LoginPopup = ({ loginPopup, handleLoginPopup }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const handleSignIn = () => {
    setShowSignIn(!showSignIn);
    setShowVerify(false);
  };
  const handleVerify = () => {
    setShowVerify(!showVerify);
  };
  const loginPopupRef = useRef();

  {window.addEventListener("click", (e) => {
    if (e.target === loginPopupRef.current) {
      setShowSignIn(false);
      setShowVerify(false);
      handleLoginPopup(false);
    }
  });
  }
  return (
    <>
      {loginPopup && (
        <div
          ref={loginPopupRef}
          className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm"
        >
          <div className="rounded-2xl bg-white/10 backdrop-md shadow-custom-inset sm:w-[600px] md:w-[380px] ">
            {
            showVerify ? 
              (<Verify handleSignIn={handleSignIn} handleVerify={handleVerify} />)
              : showSignIn ?
              (<Signin handleSignIn={handleSignIn} handleVerify={handleVerify}/>)
              : (<Login handleSignIn={handleSignIn} handleVerify={handleVerify} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPopup;
