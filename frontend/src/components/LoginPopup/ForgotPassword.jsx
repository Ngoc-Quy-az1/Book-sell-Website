import React, { useState } from "react";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import { FaEye,FaEyeSlash } from "react-icons/fa6";
import * as yup from "yup";
const ForgotPassword = ( {handleForgotPassword, handleNotice, handleVerify, handleMail } ) => {
  
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

  const handleFormSubmit = (values) => {
    //Tim User trong database
    handleMail(values);
    changePassword(values);
  };
    //Đẩy DL lên Database 
  const changePassword = (form) =>{
    fetch("http://localhost:8090/api/users/forgotpassword",{
      method:"POST",      
      headers: {      
        'Content-Type': 'application/json'
        },
      body:JSON.stringify(form)
    }) .then((response) => {
      if (!response.ok) return response.text();
      return response.text();
    }).then((data) => {
      console.log(data);
      if (data=="ok") {
        handleVerify();
      }
      else {
        handleNotice("No account with this email or phone number found", true)
      }
    });
  }

  return (
      <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[400px]"}>
        <h1 className="text-3xl text-shadow font-bold text-center mb-4">
          Enter your Email
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
          <TextField id="infor" 
            type="text" 
            className="input" 
            onBlur={handleBlur}
            label="Email or Phone Number"
            onChange={handleChange}
            value={values.mail}
            name="infor"
            error={!!touched.mail && !!errors.mail}
            helperText={touched.mail && errors.mail}/>
          <div className="relative">
            <TextField id="password" 
              type={showPassword1 ? "text" : "password"} 
              className="input"
              onBlur={handleBlur} 
              label="New Password"
              onChange={handleChange}
              value={values.password}
              name="password"
              error={!!touched.password && !!errors.password}
              helperText={touched.password && errors.password}/>
            {showPassword1 ? (
             <FaEye
                 className=" absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer "
                 onClick={() => setShowPassword1(!showPassword1)}
               />
             ) : (
               <FaEyeSlash
                 className=" absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer "
                 onClick={() => setShowPassword1(!showPassword1)}
               />
             )}
          </div>
          <div className="relative">
          <TextField id="password2" 
            type={showPassword2 ? "text" : "password"} 
            className="input"
            onBlur={handleBlur}
            label="Confirm Password"
            onChange={handleChange}
            value={values.password2}
            name="password2"
            error={!!touched.password2 && !!errors.password2}
            helperText={touched.password2 && errors.password2}/>
          {showPassword2 ? (
            <FaEye
              className=" absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer "
              onClick={() => setShowPassword2(!showPassword2)}
            />
          ) : (
            <FaEyeSlash
              className=" absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer "
              onClick={() => setShowPassword2(!showPassword2)}
            />
          )}
          </div>
          <div className="flex justify-center py-5">
            <button className="primary-btn"
            type="submit"
            >Confirm Your Email</button>
          </div>
        </form>
      )}
      </Formik>
    </div>
  );
};
const phoneRegExp =/^\d{5,15}$/;
const emailRegExp = /^[^@\s]+$/
const checkoutSchema = yup.object().shape({
  infor: yup.string()
  .test("checkInput", "Phone or Email is Required",(item) => {
    return (phoneRegExp.test(item) || !(emailRegExp.test(item)))
  })
  .required("required"),
  password: yup.string().required("required"),
  password2: yup.string().required("required").when("password", (password) => {
    return yup.string().oneOf([password[0]],"Password do not match");
})});
const initialValues = {
  infor: "",
  password: "",
  password2: "",
  code:""
};
export default ForgotPassword;
