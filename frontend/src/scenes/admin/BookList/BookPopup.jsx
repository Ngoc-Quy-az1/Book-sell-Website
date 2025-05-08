import React, { useState, useRef } from "react";
import UpdateBook from "./UpdateBook";
import Notice from "../notice/index";
const BookPopup = ({ bookPopup, handleBookPopup, book, handleDelete }) => {
  const bookPopupRef = useRef();
  window.addEventListener("click", (e) => {
    if (e.target === bookPopupRef.current) {
      handleBookPopup(false);
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
      {bookPopup && (<>
        <div
          ref={bookPopupRef}
          className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm"
        >
          <div className="rounded-2xl bg-white/10 backdrop-md shadow-custom-inset sm:w-[600px] md:w-[380px] ">
            <UpdateBook book={book} showNotice={showNotice} setError={setError} setMessage={setMessage} handleBookPopup={handleBookPopup} handleDelete={handleDelete} />
            
          </div>
        </div>
        <Notice notice={notice} message={message} showNotice={showNotice} isError={error}/>
        </>
      )}
    </>
  );
};

export default BookPopup;
