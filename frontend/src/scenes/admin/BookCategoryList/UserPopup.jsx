import React, { useState, useRef, useEffect } from "react";
import UpdateBook from "./UpdateBook";
import Notice from "../Notice/index";
const UserPopup = ({ userPopup, handleUserPopup,book }) => {
  const userPopupRef = useRef();
  window.addEventListener("click", (e) => {
    if (e.target === userPopupRef.current) {
      handleUserPopup(false);
    }
  });
  
    const [notice, setNotice] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const showNotice = () => {
      setNotice(!notice);
      setTimeout(() => {setNotice()},3000)
    }
  return (
    <>
      {userPopup && (<>
        <div
          ref={userPopupRef}
          className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm"
        >
          <div className="rounded-2xl bg-white/10 backdrop-md shadow-custom-inset sm:w-[600px] md:w-[380px] ">
            <UpdateBook book={book} showNotice={showNotice} setError={setError} setMessage={setMessage} handleUserPopup={handleUserPopup} />
            
          </div>
        </div>
        <Notice notice={notice} message={message} showNotice={showNotice} isError={error}/>
        </>
      )}
    </>
  );
};

export default UserPopup;
