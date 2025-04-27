import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineVpnKey } from "react-icons/md";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { redirect } from "react-router-dom";
import Cookies from "js.cookie"

const Login = ({ handleSignUp, handleNotice, handleForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleFormSubmit = (values) => {
    if (phoneRegExp.test(values.input)) values.phone = values.input;
    else values.mail = values.input;
    handleLogin(values);
  };
  //Đẩy DL lên Database 
  const handleLogin = (form) =>{
    fetch("http://localhost:8090/api/users/login",{
      method:"POST",      
      headers: {      
        'Content-Type': 'application/json',
        },
      body: JSON.stringify(form)
    }) .then((response) => {
      if (!response.ok) {
        return response.text();
      }
      return response.json();
    }).then((data) => {
      Cookies.set('authToken', data.token);
      Cookies.set('userId', data.user_id);
      handleNotice(data.message, !data.status);
      location.reload();
    });
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[400px] ">
      <h1 className="text-3xl font-bold text-center mb-4 text-shadow">
        Login
      </h1>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
   
            <div className="relative">
              <IoPersonCircleOutline size={30} className=" absolute top-1/2 -translate-y-1/2" />
              <TextField id="input" 
              type="text" 
              className="input" 
              onBlur={handleBlur}
              label="Phone or Email"
              sx={{ marginLeft: "30px", width:"90%"}}
              onChange={handleChange}
              value={values.input}
              name="input"
              error={!!touched.input && !!errors.input}
              helperText={touched.input && errors.input}/>
            </div>
          </div>
          <div>
            <div className="relative py-3">
            <MdOutlineVpnKey size={30} className=" absolute top-1/2 -translate-y-1/2"/>
            <TextField id="password" 
              type={showPassword ? "text" : "password"}
              className="input" 
              onBlur={handleBlur}
              label="password"
              sx={{ marginLeft: "30px", width:"90%"}}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={!!touched.password && !!errors.password}/>

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
        <div className="flex justify-center">
          <button className="primary-btn" type="submit"
          >
            Submit
          </button>
        </div>
        </form>
      )}
      </Formik>
        <p
          className="text-center text-sm my-3 hover:text-blue-700 cursor-pointer text-shadow"
          onClick={handleForgotPassword}
        >
          Forgot your password?
        </p>
        <p
          className="text-center text-sm my-3 hover:text-blue-700 cursor-pointer text-shadow"
          onClick={handleSignUp}
        >
          No Account? Signup here
        </p>
      </div>
  );
};
const phoneRegExp =/^\d{5,15}$/;
const emailRegExp = /^[^@\s]+$/
const checkoutSchema = yup.object().shape({
  input: yup.string()
  .test("checkInput", "Phone or Email is Required",(item) => {
    return (phoneRegExp.test(item) || !(emailRegExp.test(item)))
  })
  .required("required"),
  password: yup.string().required("required"),
});
const initialValues = {
  input: "",
  phone: "",
  mail: "",
  password: "",
};

export default Login;
