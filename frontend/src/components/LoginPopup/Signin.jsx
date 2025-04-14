import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaLinkedinIn } from "react-icons/fa";
const Signin = ( {handleSignIn,handleVerify} ) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = (values) => {
    handleMail(values);
    createUser(values);
  };

  //Đẩy DL lên Database 
  const createUser = (form) =>{
    fetch("http://localhost:8090/api/users/register",{
      method:"POST",      
      headers: {      
        'Content-Type': 'application/json'
        },
      body:JSON.stringify(form)
    }) .then((response) => {
      if (!response.ok) return response.text();
      return response.json();
    }).then((data) => {
      if (data) {
        handleVerify();
      }
      else {
        handleNotice("User Already Exist", true)
      }
    });
  }

  return (
    <>
      <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[400px]"}>
        <h1 className="text-3xl text-shadow font-bold text-center mb-4">
          Create Your Account
        </h1>
        <form className="flex flex-col gap-3">
          <div>
            <label for="username" className="input-label">
              Username
            </label>
            <input id="username" type="text" className="input" />
          </div>
          <div>
            <label for="email" className="input-label">
              Email
            </label>
            <input id="email" type="email" className="input" />
          </div>
          <div>
            <label for="phone" className="input-label">
              Phone
            </label>
            <input id="phone" type="phone" className="input" />
          </div>
          <div>
            <label for="password" className="input-label">
              Password
            </label>
            <div className="relative">
              <input
                className="input pr-8"
                id="password"
                type={showPassword ? "text" : "password"}
              />

              {showPassword ? (
                <FaEye
                  className=" absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer "
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaEyeSlash
                  className=" absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer "
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>
        </form>
        <div className="flex justify-center py-5">
          <button className="primary-btn"
          onClick={handleVerify}
          >Create Account</button>
        </div>
        <p className="text-center  text-sm my-3">or login with</p>
        <div className="flex gap-6 justify-center">
          <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-custom-inset hover:scale-110 transition-all duration-300">
            <FcGoogle className="text-3xl" />
          </div>
          <div className="bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center shadow-custom-inset hover:scale-110 transition-all duration-300">
            <FaLinkedinIn className="text-2xl text-white" />
          </div>
        </div>
        <p
          className="text-center text-sm my-3 hover:text-blue-700 cursor-pointer text-shadow"
          onClick={handleSignIn}
        >
          Already have an Account? Log in
        </p>
      </div>
    </>
  );
};
const phoneRegExp =/^\d{5,15}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  mail: yup.string().email("invalid mail").required("required"),
  phone: yup
  .string()
  .matches(phoneRegExp, "Phone number is not valid")
  .required("required"),
  password: yup.string().required("required"),
});
const initialValues = {
  name: "",
  mail: "",
  phone: "",
  password: "",
  code:""
};
export default Signin;
