import React, { useState } from "react";
import OTPInput from "react-otp-input";
const Verify = ( {handleSignIn, handleVerify, mail, handleNotice} ) => {
  const [code, setCode] = useState('','','','','','');
  const url="http://localhost:8090/api/users/verify?mail="+mail;

  const check = () => {
    verifyUser();
  }

  const verifyUser = () =>{
    fetch(url,{
      method:"POST",      
      headers: {      
        'Content-Type': 'application/json'
        },
      body:JSON.stringify({code})
    }) .then((response) => {
      if (!response.ok) return response.json();
      return response.json();
    }).then((data) => {
      handleNotice(data.message,!data.status)
      if (data.status) handleVerify();
      if (data.message=='Your account is enable! Log in now!') handleVerify();
    });
  }

  return (
      <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[400px]"}>
        <h1 className="text-3xl text-shadow font-bold text-center mb-4">
          Enter OTP sent to Email
        </h1>
        <div className="flex justify-center ">
          <OTPInput
            value={code}
            onChange={setCode}
            numInputs={6}
            inputStyle={{
              
              width: '40px',
              height: '40px',
              border: '1px solid black',
              textAlign: 'center',
            }}
            renderInput={(props) => <input {...props} />}
            />
        </div>
        <div className="flex justify-center py-5">
          <button className="primary-btn"
          onClick={check}
          >Confirm</button>
        </div>
        <p className="text-center  text-sm my-3"></p>
        <p
          className="text-center text-sm my-3 hover:text-blue-700 cursor-pointer text-shadow"
          
        >
          
        </p>
      </div>
  );
};

export default Verify;
