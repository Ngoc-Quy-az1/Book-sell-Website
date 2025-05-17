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

const Login = ({ resetStates, handleSignUp, handleForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });
  const formRef = useRef();
  const navigate = useNavigate();

  const showNotification = (message, isError = false) => {
    setNotification({ show: true, message, isError });
    if (!isError) {
      // Nếu là thông báo thành công, đợi 1.5 giây trước khi reload
      setTimeout(() => {
        location.reload();
      }, 1500);
    } else {
      // Nếu là thông báo lỗi, tự động ẩn sau 3 giây
      setTimeout(() => {
        setNotification({ show: false, message: '', isError: false });
      }, 3000);
    }
  };

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
          showNotification("Login successful! Redirecting...", false);
        } else {
          // Xác định lỗi gắn với input hay password
          const msg = data.message?.toLowerCase() || "";

          if (msg.includes("password")) {
            setPasswordError(data.message);
            setInputError("");
            showNotification(data.message, true);
          } else {
            setInputError(data.message);
            setPasswordError("");
            showNotification(data.message, true);
          }
        }
      })
      .catch(() => {
        const errorMsg = "Server error. Please try again later.";
        setInputError(errorMsg);
        setPasswordError("");
        showNotification(errorMsg, true);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
      <div ref={formRef} className="w-[850px] max-w-full bg-white rounded-2xl shadow-2xl flex overflow-hidden min-h-[500px] relative">
        {/* Nút X */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 z-10"
          onClick={resetStates}
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
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 p-8">
          <img src={logo} alt="Logo" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-center mb-2 text-green-700 dark:text-green-400">Welcome Back!</h1>
          
          {/* Notification */}
          {notification.show && (
            <div className={`w-full mb-4 p-3 rounded-lg text-center ${
              notification.isError 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            }`}>
              {notification.message}
            </div>
          )}

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
                    sx={{ 
                      width: "100%",
                      '& .MuiInputLabel-root': {
                        color: 'inherit',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#22c55e',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'inherit',
                      },
                      '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                        color: 'inherit',
                        opacity: 0.7,
                      },
                    }}
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
                          <IoPersonCircleOutline size={22} className="text-gray-400 dark:text-gray-500" />
                        </InputAdornment>
                      ),
                      style: { borderRadius: 12, background: "transparent" }
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
                    sx={{ 
                      width: "100%",
                      '& .MuiInputLabel-root': {
                        color: 'inherit',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#22c55e',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'inherit',
                      },
                      '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                        color: 'inherit',
                        opacity: 0.7,
                      },
                    }}
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
                          <MdOutlineVpnKey size={22} className="text-gray-400 dark:text-gray-500" />
                        </InputAdornment>
                      ),
                      endAdornment: showPassword ? (
                        <FaEye
                          className="cursor-pointer text-gray-400 dark:text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <FaEyeSlash
                          className="cursor-pointer text-gray-400 dark:text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ),
                      style: { borderRadius: 12, background: "transparent" }
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
              className="text-sm text-green-600 dark:text-green-400 hover:underline mb-2"
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
