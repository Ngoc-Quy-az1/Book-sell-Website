import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import * as yup from "yup";
const NewPassword = ( {handleNewPassword, handleNotice } ) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [disable, setDisable] = useState(true);
  const handleDisable = () => {
    setDisable(false)
  }

  const handleFormSubmit = (values) => {
    console.log("updated");
    updateUser(values);
    handleNewPassword();
  };

  //Đẩy DL lên Database   
  const updateUser = (user) => {
    let res = "";
    
    fetch("http://localhost:8090/api/admin/updateUsers/" + user.id,{method:"PUT",
      headers: {      
      'Content-Type': 'application/json'
      },
      body:JSON.stringify(user)
    }).then((response) => {
      if (!response.ok) return response.text();
    }).then((data) => {
      if (data!=undefined) {res="Updated Failed";  setError(true)}// this will be a string
      else {res="Account Successfully Updated"; setError(false)}
      setMessage(res); 
      showNotice();
    });
    return res;
  }

  return (
      <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[400px]"}>
        <h1 className="text-3xl text-shadow font-bold text-center mb-4">
          Enter Your New Password
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
          <div className="relative">
            <TextField id="password" 
              type={showPassword1 ? "text" : "password"} 
              className="input"
              onBlur={handleBlur} 
              label="Password"
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
            >Confirm Change</button>
          </div>
        </form>
      )}
      </Formik>
    </div>
  );
};
const checkoutSchema = yup.object().shape({
  password: yup.string().required("required"),
  password2: yup.string().required("required").when("password", (password) => {
    return yup.string().oneOf([password[0]],"Password do not match");
  })
});
const initialValues = {
  name: "",
  mail: "",
  phone: "",
  password: "",
  password2: ""
};
export default NewPassword;
