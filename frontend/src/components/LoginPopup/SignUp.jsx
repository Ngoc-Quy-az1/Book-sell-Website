import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik } from "formik";
import {  TextField } from "@mui/material";
import * as yup from "yup";
const SignUp = ( {handleSignUp, handleVerify, handleMail, handleNotice } ) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = (values) => {
    values.full_name=values.lastName + ' ' + values.firstName;
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
      <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[400px]"}>
        <h1 className="text-3xl text-shadow font-bold text-center mb-4">
          Create Your Account
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
            <TextField id="name" 
              type="text" 
              className="input" 
              onBlur={handleBlur}
              label="Username"
              onChange={handleChange}
              value={values.name}
              name="name"
              error={!!touched.name && !!errors.name}
              helperText={touched.name && errors.name}/>
            <TextField id="firstName" 
              type="text" 
              className="input" 
              onBlur={handleBlur}
              label="First Name"
              onChange={handleChange}
              value={values.firstName}
              name="firstName"
              error={!!touched.firstName && !!errors.firstName}
              helperText={touched.firstName && errors.firstName}/>
            <TextField id="lastName" 
              type="text" 
              className="input" 
              onBlur={handleBlur}
              label="Last Name"
              onChange={handleChange}
              value={values.lastName}
              name="lastName"
              error={!!touched.lastName && !!errors.lastName}
              helperText={touched.lastName && errors.lastName}/>   
            <TextField id="address" 
              type="text" 
              className="input" 
              onBlur={handleBlur}
              label="Address"
              onChange={handleChange}
              value={values.address}
              name="address"
              error={!!touched.address && !!errors.address}
              helperText={touched.address && errors.address}/>           
            <TextField id="mail" 
              type="text" 
              className="input" 
              onBlur={handleBlur}
              label="Email"
              onChange={handleChange}
              value={values.mail}
              name="mail"
              error={!!touched.mail && !!errors.mail}
              helperText={touched.mail && errors.mail}/>
            <TextField id="phone" 
              type="text" 
              className="input" 
              onBlur={handleBlur}
              label="Phone Number"
              onChange={handleChange}
              value={values.phone}
              name="phone"
              error={!!touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}/>
            <div className="relative">
            <TextField id="password" 
              type={showPassword ? "text" : "password"} 
              className="input"
              onBlur={handleBlur}
              label="Password"
              onChange={handleChange}
              value={values.password}
              name="password"
              error={!!touched.password && !!errors.password}
              helperText={touched.password && errors.password}/>
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
        <div className="flex justify-center py-5">
          <button className="primary-btn"
          type="submit"
          >Create Account</button>
        </div>
        </form>
      )}
      </Formik>
        <p
          className="text-center text-sm my-3 hover:text-blue-700 cursor-pointer text-shadow"
          onClick={handleSignUp}
        >
          Already have an Account? Log in
        </p>
    </div>
  );
};
const phoneRegExp =/^\d{5,15}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  address: yup.string().required("required"),
  mail: yup.string().email("invalid mail").required("required"),
  phone: yup
  .string()
  .matches(phoneRegExp, "Phone number is not valid")
  .required("required"),
  password: yup.string().required("required"),
});
const initialValues = {
  name: "",
  firstName:"",
  lastName:"",
  full_name:"",
  address:"",
  mail: "",
  phone: "",
  password: "",
  code:""
};
export default SignUp;
