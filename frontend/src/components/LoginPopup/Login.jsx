import React, { useState, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineVpnKey } from "react-icons/md";
import { Formik } from "formik";
import { TextField, InputAdornment } from "@mui/material";
import * as yup from "yup";
import Cookies from "js.cookie";
import logo from "../../assets/website/logo.png";
import bgVideo from "./video/185096-874643413.mp4";
import { useNavigate } from "react-router-dom";

const Login = ({ handleSignUp, handleForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const formRef = useRef();
  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    if (phoneRegExp.test(values.input)) values.phone = values.input;
    else values.mail = values.input;
    handleLogin(values);
  };

  const handleLogin = (form) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) return response.text();
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          Cookies.set("authToken", data.token);
          Cookies.set("userId", data.user_id);
          Cookies.set("refreshToken", data.refreshToken);
          location.reload();
        } else {
          // Xác định lỗi gắn với input hay password
          const msg = data.message?.toLowerCase() || "";

          if (msg.includes("password")) {
            setPasswordError(data.message);
            setInputError("");
          } else {
            setInputError(data.message);
            setPasswordError("");
          }
        }
      })
      .catch(() => {
        setInputError("Server error. Please try again later.");
        setPasswordError("");
      });
  };

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
              Great experience <br /> Extraordinary Products
            </h2>
            <div className="mt-auto w-full flex flex-col items-center">
              <span className="text-white/80 mb-2">Don't have an account?</span>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 rounded-lg shadow transition"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-8">
          <img src={logo} alt="Logo" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-center mb-2 text-green-700 dark:text-green-400">Welcome Back!</h1>

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
                {/* Username or Email */}
                <div className="relative">
                  <TextField
                    id="input"
                    type="text"
                    onBlur={handleBlur}
                    label="Enter Username"
                    sx={{ width: "100%" }}
                    onChange={(e) => {
                      handleChange(e);
                      setInputError(""); // reset nếu nhập lại
                    }}
                    value={values.input}
                    name="input"
                    error={!!touched.input && (!!errors.input || !!inputError)}
                    helperText={(touched.input && errors.input) || inputError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IoPersonCircleOutline size={22} className="text-gray-400" />
                        </InputAdornment>
                      ),
                      style: { borderRadius: 12, background: "#fff" }
                    }}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <TextField
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onBlur={handleBlur}
                    label="Enter Password"
                    sx={{ width: "100%" }}
                    onChange={(e) => {
                      handleChange(e);
                      setPasswordError(""); 
                    }}
                    value={values.password}
                    name="password"
                    error={!!touched.password && (!!errors.password || !!passwordError)}
                    helperText={(touched.password && errors.password) || passwordError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MdOutlineVpnKey size={22} className="text-gray-400" />
                        </InputAdornment>
                      ),
                      endAdornment: showPassword ? (
                        <FaEye
                          className="cursor-pointer text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <FaEyeSlash
                          className="cursor-pointer text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ),
                      style: { borderRadius: 12, background: "#fff" }
                    }}
                  />
                </div>

                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg py-2 mt-2 transition"
                  type="submit"
                >
                  Login
                </button>
              </form>
            )}
          </Formik>

          <div className="flex flex-col items-center mt-4 w-full max-w-xs">
            <button
              className="text-sm text-green-600 hover:underline mb-2"
              onClick={handleForgotPassword}
            >
              Forgot your password? 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Regex & validation
const phoneRegExp = /^\d{5,15}$/;
const emailRegExp = /^[^@\s]+$/;
const usernameRegExp = /^[a-zA-Z0-9_.@]+$/;

const checkoutSchema = yup.object().shape({
  input: yup
    .string()
    .matches(usernameRegExp, "Username must not contain special characters")
    .test("checkInput", "Phone or Email is Required", (item) => {
      return phoneRegExp.test(item) || !emailRegExp.test(item);
    })
    .required("Required"),
  password: yup.string().required("Required"),
});

const initialValues = {
  input: "",
  phone: "",
  mail: "",
  password: "",
};

export default Login;
