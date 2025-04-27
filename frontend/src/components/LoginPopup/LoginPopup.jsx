import React, { useState, useRef} from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Verify from "./Verify";
import Notice from "../Notice";
import ForgotPassword from "./ForgotPassword";

const LoginPopup = ({ loginPopup, handleLoginPopup }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const handleEmail = (str) => {
    setEmail(str);
  }
  const handleSignUp = () => {
    setShowSignUp(!showSignUp);
    setShowVerify();
  };
  const handleVerify = () => {
    if (forgotPassword && showVerify) {
      handleForgotPassword();
    }
    setShowVerify(!showVerify);
  };
  const handleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
  }
  const loginPopupRef = useRef();

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
window.addEventListener("click", (e) => {
  if (e.target === loginPopupRef.current) {
    setForgotPassword(false);
    handleLoginPopup(false);
  }
  });

  return (
    <>
    <Notice notice={notice} message={message} showNotice={showNotice} isError={error}/>
      {loginPopup && (
        <div
          ref={loginPopupRef}
          className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm"
        >
          <div className="rounded-2xl bg-white/10 backdrop-md shadow-custom-inset sm:w-[600px] md:w-[380px] ">
          
            <Notice notice={notice} message={message} showNotice={showNotice} isError={error}/>
            {
              (showVerify) ? <Verify handleVerify={handleVerify} mail={email} handleNotice={handleNotice} forgotPassword={forgotPassword}/>
              : (showSignUp) ? <SignUp handleSignUp={handleSignUp} handleVerify={handleVerify} handleMail={handleEmail} handleNotice={handleNotice}/>
              : (forgotPassword) ? <ForgotPassword handleForgotPassword={handleForgotPassword} handleNotice={handleNotice} handleVerify={handleVerify} handleMail={handleEmail}/>
              : <Login handleSignUp={handleSignUp} handleNotice={handleNotice} handleForgotPassword={handleForgotPassword}/>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPopup;
