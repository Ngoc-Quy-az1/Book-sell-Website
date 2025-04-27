import React, { useState } from "react";
import OTPInput from "react-otp-input";
const Verify = ( {handleVerify, mail, handleNotice, forgotPassword} ) => {
  const [code, setCode] = useState('','','','','','');
  const selectUrl = () => {
    if (forgotPassword) return "http://localhost:8090/api/users/confirmcode";
    else return "http://localhost:8090/api/users/verify?mail="+mail.mail;
  }

  const check = () => {
    verifyUser();
  }

  const verifyUser = () =>{
    mail.code = code;
    fetch(selectUrl(),{
      method:"POST",      
      headers: {      
        'Content-Type': 'application/json'
        },
      body:JSON.stringify(mail)
    }) .then((response) => {
      if (!response.ok) return response.json();
      if (forgotPassword) return response.text();
      return response.json();
    })
    .then((data) => {
      if (forgotPassword) {
        if (data == "ok"){
          handleNotice("Password Successfully Changed",false);
          handleVerify();
        }
        else handleNotice("Wrong Code",true);
        return;
      };
      handleNotice(data.message,!data.status);
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
          onClick={handleVerify}
        >
          Already have an Account? Log in
        </p>
      </div>
  );
};

export default Verify;
