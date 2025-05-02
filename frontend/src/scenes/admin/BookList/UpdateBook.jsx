import React, { useState , useEffect,useContext } from "react";
import { Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Admin/Header";
import { ColorModeContext,tokens } from "../../../theme";
import Cookies from "js.cookie"

const UpdateBook = ({ book, showNotice , setError, setMessage, handleBookPopup, handleDelete }) => {
  useEffect(() => {
  },[])
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [updateInformation, getUpdateImformation] = useState(true);
  const handleUpdate = () => {
    getUpdateImformation(!updateInformation);
    
  }
  const handleDeleteBook = () => {
    deleteBook(book.id);
    setTimeout(() => {handleBookPopup()},3000)
    handleDelete(book);
  }
  //Đẩy DL lên Database 
  const updateBook = (form) =>{
    fetch("http://localhost:8090/api/books/update/"+form.id,{
      method:"PUT",      
      headers: {      
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
      body:JSON.stringify(form)
    }) .then((response) => {
      if (!response.ok) return response.text();
    }).then((data) => {
      if (data!=undefined) {setMessage(data); setError(true)}// this will be a string
      else {setMessage("Updated!"); setError(false)}
      showNotice();
    });
  }
  const deleteBook = (id) =>{
    fetch("http://localhost:8090/api/books/delete/"+id,{
      method:"DELETE",      
      headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`}
    }) .then((response) => {
      if (!response.ok) return response.text();
    }).then((data) => {
      if (data!=undefined) {setMessage(data); setError(true)}// this will be a string
      else {setMessage("Book Removed!"); setError(false)}
      showNotice();
    });
  }
    
  const handleFormSubmit = (form) => {
    console.log(JSON.stringify(form));
    updateBook(form);
  };
  return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md rounded-md duration-200 w-[500px]"
      style={{
          backgroundColor: colors.primary[400],
          borderColor: colors.primary[500]
      }}>
        {book && (<Box m="20px">
      <Header title="BOOK DETAIL" subtitle="Book Details" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={book}
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
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Title"
                disabled={updateInformation}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Author"
              disabled={updateInformation}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.author}
              name="author"
              error={!!touched.author && !!errors.author}
              helperText={touched.author && errors.author}
              sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Category"
                disabled={updateInformation}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.category}
                name="category"
                error={!!touched.category && !!errors.category}
                helperText={touched.category && errors.category}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Original Price"
                disabled={updateInformation}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price_original}
                name="price_original"
                error={!!touched.price_original && !!errors.price_original}
                helperText={touched.price_original && errors.price_original}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Discounted Price"
                disabled={updateInformation}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price_discounted}
                name="price_discounted"
                error={!!touched.price_discounted && !!errors.price_discounted}
                helperText={touched.price_discounted && errors.price_discounted}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Image"
                disabled={updateInformation}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.image}
                name="image"
                error={!!touched.image && !!errors.image}
                helperText={touched.image && errors.image}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px" margin="30px">
              <Box marginRight="30px">
              <Button type={updateInformation ? "submit" : "button" } color="secondary" variant="contained" onClick={handleUpdate}>
              {updateInformation ? "Edit Details" : "Save"}</Button>
              </Box>
              <Box >
              <Button type="button" color="secondary" variant="contained" onClick={handleDeleteBook}>
              Remove Book</Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
    )}
      </div>
  );
};

//Ràng buộc 
const price_discountedRegExp =/^\d{5,15}$/;

const checkoutSchema = yup.object().shape({
  title: yup.string().required("required"),
  category: yup.string().required("required"),
  author: yup.string().required("required"),
  image: yup.string().required("required"),
  price_original: yup.string().required("required"),
  price_discounted: yup.string().required("required"),

});


export default UpdateBook;
