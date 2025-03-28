import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaLinkedinIn } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineVpnKey } from "react-icons/md";
import Admin from "../../admin.jsx";
const handleAdmin = () =>{
  alert("login");
  return (
    <Admin/>
  )
}
const Login = ({ handleSignIn,handleVerify }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[400px] h-[450px]">
        <h1 className="text-3xl font-bold text-center mb-4 text-shadow">
          Login
        </h1>
        <form className="flex flex-col gap-3">
          <div>
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <div className="relative">
              <IoPersonCircleOutline className=" absolute top-1/2 left-3 -translate-y-1/2"/>
              <input id="username" type="text" className="input pl-8" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="relative py-3">
            <MdOutlineVpnKey className=" absolute top-1/2 left-3 -translate-y-1/2"/>
              <input
                className="input pl-8 pr-8"
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
        <div className="flex justify-center">
          <button className="primary-btn"
          onClick = {handleAdmin}
          >
            Submit</button>
        </div>
        <p
          className="text-center text-sm my-3 hover:text-blue-700 cursor-pointer text-shadow"
          onClick={handleVerify}
        >
          Forgot your password?
        </p>
        <p className="text-center text-sm my-3">or login with</p>
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
          No Account? Signup here
        </p>
      </div>
    </>
  );
};

export default Login;
