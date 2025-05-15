import React, { useState, useRef } from "react";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import * as yup from "yup";
import bgVideo from './video/185096-874643413.mp4';
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ handleForgotPassword, handleNotice, handleVerify, handleMail }) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const formRef = useRef();
  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    handleMail(values);
    changePassword(values);
  };
  const changePassword = (form) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/users/forgotpassword`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    }).then((response) => {
      if (!response.ok) return response.text();
      return response.text();
    }).then((data) => {
      if (data == "ok") {
        handleVerify();
      }
      else {
        handleNotice("No account with this email or phone number found", true)

      }
    });
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
      <div ref={formRef} className="w-[850px] max-w-full bg-white rounded-2xl shadow-2xl flex overflow-hidden min-h-[500px] relative">
        {/* Nút X */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 z-10"
          onClick={() => navigate("/")}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Left: Video + overlay */}
        <div className="relative w-1/2 min-h-[500px] hidden md:block">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={bgVideo}
            autoPlay
            loop
            muted
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">
              Forgot Your Password?
            </h2>
            <p className="text-white text-lg text-center mb-8 opacity-90">
              Enter your email or phone to reset your password.
            </p>
            <div className="mt-auto w-full flex flex-col items-center">
              <span className="text-white/80 mb-2">Remembered your password?</span>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 rounded-lg shadow transition"
                onClick={handleForgotPassword}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
        {/* Right: Forgot password form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-green-700 dark:text-green-400">
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
              <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
                <TextField id="infor"
                  type="text"
                  onBlur={handleBlur}
                  label="Email or Phone Number"
                  onChange={handleChange}
                  value={values.mail}
                  name="infor"
                  error={!!touched.mail && !!errors.mail}
                  helperText={touched.mail && errors.mail}
                  InputProps={{ style: { borderRadius: 12, background: '#fff' } }}
                />
                <div className="relative">
                  <TextField id="password"
                    type={showPassword1 ? "text" : "password"}
                    onBlur={handleBlur}
                    label="New Password"
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    sx={{ width: "100%" }}
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    InputProps={{ style: { borderRadius: 12, background: '#fff' } }}
                  />
                  {showPassword1 ? (
                    <FaEye
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword1(!showPassword1)}
                    />
                  ) : (
                    <FaEyeSlash
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword1(!showPassword1)}
                    />
                  )}
                </div>
                <div className="relative">
                  <TextField id="password2"
                    type={showPassword2 ? "text" : "password"}
                    onBlur={handleBlur}
                    label="Confirm Password"
                    onChange={handleChange}
                    value={values.password2}
                    name="password2"
                    sx={{ width: "100%" }}
                    error={!!touched.password2 && !!errors.password2}
                    helperText={touched.password2 && errors.password2}
                    InputProps={{ style: { borderRadius: 12, background: '#fff' } }}
                  />
                  {showPassword2 ? (
                    <FaEye
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword2(!showPassword2)}
                    />
                  ) : (
                    <FaEyeSlash
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword2(!showPassword2)}
                    />
                  )}
                </div>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg py-2 mt-2 transition"
                  type="submit"
                >
                  Confirm Your Email
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
const phoneRegExp = /^\d{5,15}$/;
const emailRegExp = /^[^@\s]+$/;
const passwordSafeRegExp = /^[^'";<>\\/]*$/;
const checkoutSchema = yup.object().shape({
  infor: yup.string()
    .test("checkInput", "Phone or Email is Required", (item) => {
      return (phoneRegExp.test(item) || !(emailRegExp.test(item)))
    })
    .required("required"),
  password: yup.string().matches(passwordSafeRegExp, "Password contains invalid characters").required("required"),
  password2: yup.string().matches(passwordSafeRegExp, "Password contains invalid characters").required("required").when("password", (password) => {
    return yup.string().oneOf([password[0]], "Password do not match");
  })
});
const initialValues = {
  infor: "",
  password: "",
  password2: "",
  code: ""
};
export default ForgotPassword;
