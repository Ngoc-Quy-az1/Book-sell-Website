import React, { useState } from "react";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import * as yup from "yup";
const ForgotPassword = ( {handleForgotPassword, handleNotice, handleVerify, handleMail } ) => {

  const handleFormSubmit = (values) => {
    //Tim User trong database
    handleMail(values.mail);
    handleVerify();
  };

  //Gui OTP

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

const checkoutSchema = yup.object().shape({
  mail: yup.string().email("invalid mail").required("required"),
});
const initialValues = {
  mail: "",
};
export default ForgotPassword;
