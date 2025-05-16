import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import * as yup from "yup";
import bgVideo from './video/185096-874643413.mp4';
import { useNavigate } from "react-router-dom";

const SignUp = ({ resetStates, backToLogin, handleSignUp, handleVerify, handleMail }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });
  const formRef = useRef();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const showNotification = (message, isError = false) => {
    setNotification({ show: true, message, isError });
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification({ show: false, message: '', isError: false });
    }, 3000);
  };

  const handleFormSubmit = (values) => {
    values.full_name = values.lastName + ' ' + values.firstName;
    handleMail(values);
    createUser(values);
  };

  const createUser = (form) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/users/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    }).then((response) => {
      if (!response.ok) return response.text();
      return response.json();
    }).then((data) => {
      if (data) {
        handleVerify();
      }
      else {
        showNotification("User Already Exist", true);
      }
    });
  }

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
              Create Your Account
            </h2>
            <p className="text-white text-lg text-center mb-8 opacity-90">
              Join us and start your journey!
            </p>
            <div className="mt-auto w-full flex flex-col items-center">
              <span className="text-white/80 mb-2">Already have an account?</span>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 rounded-lg shadow transition"
                onClick={backToLogin}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
        {/* Right: Sign up form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-green-700 dark:text-green-400">Create Your Account</h1>
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
                <TextField 
                  id="name"
                  type="text"
                  onBlur={handleBlur}
                  label="Username"
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
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
                      '&.Mui-focused .MuiInputLabel-root': {
                        color: '#22c55e',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'rgb(17, 24, 39)', // text-gray-900
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgb(239, 68, 68)', // text-red-500
                    },
                    // Dark mode styles
                    '& .dark & .MuiInputBase-input': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .dark & .MuiInputLabel-root': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                    },
                    '& .dark & .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                  InputProps={{ 
                    style: { 
                      borderRadius: 12, 
                      background: "transparent",
                      color: isDark ? '#e5e7eb' : '#111827',
                    }
                  }}
                />
                <TextField 
                  id="firstName"
                  type="text"
                  onBlur={handleBlur}
                  label="First Name"
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
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
                      '&.Mui-focused .MuiInputLabel-root': {
                        color: '#22c55e',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'rgb(17, 24, 39)', // text-gray-900
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgb(239, 68, 68)', // text-red-500
                    },
                    // Dark mode styles
                    '& .dark & .MuiInputBase-input': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .dark & .MuiInputLabel-root': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                    },
                    '& .dark & .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                  InputProps={{ 
                    style: { 
                      borderRadius: 12, 
                      background: "transparent",
                      color: isDark ? '#e5e7eb' : '#111827',
                    }
                  }}
                />
                <TextField 
                  id="lastName"
                  type="text"
                  onBlur={handleBlur}
                  label="Last Name"
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
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
                      '&.Mui-focused .MuiInputLabel-root': {
                        color: '#22c55e',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'rgb(17, 24, 39)', // text-gray-900
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgb(239, 68, 68)', // text-red-500
                    },
                    // Dark mode styles
                    '& .dark & .MuiInputBase-input': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .dark & .MuiInputLabel-root': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                    },
                    '& .dark & .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                  InputProps={{ 
                    style: { 
                      borderRadius: 12, 
                      background: "transparent",
                      color: isDark ? '#e5e7eb' : '#111827',
                    }
                  }}
                />
                <TextField 
                  id="address"
                  type="text"
                  onBlur={handleBlur}
                  label="Address"
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
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
                      '&.Mui-focused .MuiInputLabel-root': {
                        color: '#22c55e',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'rgb(17, 24, 39)', // text-gray-900
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgb(239, 68, 68)', // text-red-500
                    },
                    // Dark mode styles
                    '& .dark & .MuiInputBase-input': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .dark & .MuiInputLabel-root': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                    },
                    '& .dark & .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                  InputProps={{ 
                    style: { 
                      borderRadius: 12, 
                      background: "transparent",
                      color: isDark ? '#e5e7eb' : '#111827',
                    }
                  }}
                />
                <TextField 
                  id="mail"
                  type="text"
                  onBlur={handleBlur}
                  label="Email"
                  onChange={handleChange}
                  value={values.mail}
                  name="mail"
                  error={!!touched.mail && !!errors.mail}
                  helperText={touched.mail && errors.mail}
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
                      '&.Mui-focused .MuiInputLabel-root': {
                        color: '#22c55e',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'rgb(17, 24, 39)', // text-gray-900
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgb(239, 68, 68)', // text-red-500
                    },
                    // Dark mode styles
                    '& .dark & .MuiInputBase-input': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .dark & .MuiInputLabel-root': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                    },
                    '& .dark & .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                  InputProps={{ 
                    style: { 
                      borderRadius: 12, 
                      background: "transparent",
                      color: isDark ? '#e5e7eb' : '#111827',
                    }
                  }}
                />
                <TextField 
                  id="phone"
                  type="text"
                  onBlur={handleBlur}
                  label="Phone Number"
                  onChange={handleChange}
                  value={values.phone}
                  name="phone"
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
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
                      '&.Mui-focused .MuiInputLabel-root': {
                        color: '#22c55e',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'rgb(17, 24, 39)', // text-gray-900
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgb(239, 68, 68)', // text-red-500
                    },
                    // Dark mode styles
                    '& .dark & .MuiInputBase-input': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                      '&::placeholder': {
                        color: 'rgb(156, 163, 175)', // text-gray-400
                        opacity: 1,
                      },
                    },
                    '& .dark & .MuiInputLabel-root': {
                      color: 'rgb(229, 231, 235)', // text-gray-200
                    },
                    '& .dark & .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                  InputProps={{ 
                    style: { 
                      borderRadius: 12, 
                      background: "transparent",
                      color: isDark ? '#e5e7eb' : '#111827',
                    }
                  }}
                />
                <div className="relative">
                  <TextField 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onBlur={handleBlur}
                    label="Password"
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
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
                        '&.Mui-focused .MuiInputLabel-root': {
                          color: '#22c55e',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'rgb(17, 24, 39)', // text-gray-900
                        '&::placeholder': {
                          color: 'rgb(156, 163, 175)', // text-gray-400
                          opacity: 1,
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgb(239, 68, 68)', // text-red-500
                      },
                      // Dark mode styles
                      '& .dark & .MuiInputBase-input': {
                        color: 'rgb(229, 231, 235)', // text-gray-200
                        '&::placeholder': {
                          color: 'rgb(156, 163, 175)', // text-gray-400
                          opacity: 1,
                        },
                      },
                      '& .dark & .MuiInputLabel-root': {
                        color: 'rgb(229, 231, 235)', // text-gray-200
                      },
                      '& .dark & .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                    }}
                    InputProps={{ 
                      style: { 
                        borderRadius: 12, 
                        background: "transparent",
                        color: isDark ? '#e5e7eb' : '#111827',
                      }
                    }}
                  />
                  {showPassword ? (
                    <FaEye
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 dark:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <FaEyeSlash
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 dark:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg py-2 mt-2 transition"
                  type="submit"
                >
                  Create Account
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const usernameRegExp = /^[a-zA-Z0-9_.]+$/;
const nameRegExp = /^[a-zA-Z0-9_. ]+$/;
const phoneRegExp = /^[\d]{5,15}$/;
const passwordSafeRegExp = /^[^'";<>\\/]*$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().matches(usernameRegExp, "Username must not contain special characters").required("Required"),
  firstName: yup.string().matches(nameRegExp, "First name must not contain special characters"),
  lastName: yup.string().matches(nameRegExp, "Last name must not contain special characters"),  
  address: yup.string().required("Required"),
  mail: yup.string().email("invalid mail").required("Required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  password: yup.string().matches(passwordSafeRegExp, "Password contains invalid characters").required("Required"),
});

const initialValues = {
  name: "",
  firstName: "",
  lastName: "",
  full_name: "",
  address: "",
  mail: "",
  phone: "",
  password: "",
  code: ""
};

export default SignUp;
