import React, { useState , useEffect, useContext } from "react";
import { Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Admin/Header";
import { ColorModeContext, tokens } from "../../../theme";
import Cookies from "js.cookie";
import "../../../CheckToken";
import axios from "axios";

const UpdateBook = ({ book, showNotice , setError, setMessage, handleBookPopup, handleDelete }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [updateInformation, getUpdateImformation] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const handleUpdate = () => {
    getUpdateImformation(!updateInformation);
    //console.log("click")
  }

  const handleDeleteBook = () => {
    deleteBook(book.id);
    setTimeout(() => { handleBookPopup(); }, 3000);
    handleDelete(book);
  }

  const updateBook = async (form) => {
    await axios.put(`${apiUrl}/api/books/update/` + form.id, form, {
      headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
    })
    .then((response) => {
      if (response.data !== undefined) {
        setMessage(response.data);
        setError(true);
      } else {
        setMessage("Updated!");
        setError(false);
      }
      showNotice();
    });
  }

  const deleteBook = async (id) => {
    await axios.delete(`${apiUrl}/api/books/delete/` + id, {
      headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
    })
    .then(() => {
      setMessage("Deleted!");
      setError(false);
      showNotice();
    })
    .catch((response) => {
      setMessage(response.response.data);
      setError(true);
      showNotice();
    });
  }

  const handleFormSubmit = (form) => {
    //console.log(JSON.stringify(form));
    updateBook(form);
  };

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); 
  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/dllgtkb4a/image/upload",
    formData
  );
  return response.data.secure_url; 
}
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[85vh] p-4 shadow-md rounded-md duration-200 w-2/3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
      style={{
        backgroundColor: colors.primary[400],
        borderColor: colors.primary[500]
      }}>
      {book && (
        <Box m="20px">
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
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
                >
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="text" label="Title" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.title} name="title" error={!!touched.title && !!errors.title} helperText={touched.title && errors.title} sx={{ gridColumn: "span 4" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="text" label="Author" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.author} name="author" error={!!touched.author && !!errors.author} helperText={touched.author && errors.author} sx={{ gridColumn: "span 2" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="text" label="Translator" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.translator} name="translator" error={!!touched.translator && !!errors.translator} helperText={touched.translator && errors.translator} sx={{ gridColumn: "span 2" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="text" label="Publisher" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.publisher} name="publisher" error={!!touched.publisher && !!errors.publisher} helperText={touched.publisher && errors.publisher} sx={{ gridColumn: "span 4" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="text" label="Category" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.category} name="category" error={!!touched.category && !!errors.category} helperText={touched.category && errors.category} sx={{ gridColumn: "span 4" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="number" label="Original Price" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.price_original} name="price_original" error={!!touched.price_original && !!errors.price_original} helperText={touched.price_original && errors.price_original} sx={{ gridColumn: "span 2" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="number" label="Discounted Price" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.price_discounted} name="price_discounted" error={!!touched.price_discounted && !!errors.price_discounted} helperText={touched.price_discounted && errors.price_discounted} sx={{ gridColumn: "span 2" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="number" label="Stock" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.stock} name="stock" error={!!touched.stock && !!errors.stock} helperText={touched.stock && errors.stock} sx={{ gridColumn: "span 2" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="number" label="Page Count" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.page} name="page" error={!!touched.page && !!errors.page} helperText={touched.page && errors.page} sx={{ gridColumn: "span 2" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="text" label="Dimensions" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.dimensions} name="dimensions" error={!!touched.dimensions && !!errors.dimensions} helperText={touched.dimensions && errors.dimensions} sx={{ gridColumn: "span 4" }} />
                  <TextField fullWidth color={colors.grey[100]} multiline rows={4} variant="filled" type="text" label="Description" disabled={updateInformation} onBlur={handleBlur} onChange={handleChange} value={values.description} name="description" error={!!touched.description && !!errors.description} helperText={touched.description && errors.description} sx={{ gridColumn: "span 4" }} />
                  <TextField fullWidth color={colors.grey[100]} variant="filled" type="text" label="Created At" disabled={updateInformation} value={values.create_at} name="create_at" sx={{ gridColumn: "span 4" }} />
                  <Box sx={{ gridColumn: "span 4" }}>
                    {!updateInformation && (<input
                        accept="image/*"
                        type="file"
                        onChange={async (event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                            try {
                            const url = await uploadToCloudinary(file);
                            setFieldValue("image", url);      // Save to form
                            setImagePreview(url);             // Show preview
                            } catch (err) {
                            console.error("Cloudinary upload failed:", err);
                            setMessage("Image upload failed");
                            setError(true);
                            showNotice();
                            }
                        }
                        }}
                    />)}
                    {errors.image && touched.image && (
                        <div style={{ color: "red", marginTop: "5px" }}>{errors.image}</div>
                    )}
                    </Box>
                </Box>
                {values.image && (
                  <Box display="flex" justifyContent="center" mb={2} mt={2}>
                    <img src={values.image} alt="Book Cover" style={{ maxHeight: "200px", borderRadius: "8px" }} />
                  </Box>
                )}
                <Box display="flex" justifyContent="center" mt="20px" margin="30px">
                  <Box marginRight="30px">{updateInformation ? (
                      <Button 
                        type="button" 
                        color="secondary" 
                        variant="contained" 
                        onClick={handleUpdate}
                      >
                        Edit Details
                      </Button>
                  ) : (
                      <Button 
                        type="submit" 
                        color="secondary" 
                        variant="contained"
                      >
                        Save
                      </Button>
                  )}
                  </Box>
                  <Box>
                    <Button type="button" color="secondary" variant="contained" onClick={handleDeleteBook}>
                      Remove Book
                    </Button>
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

const checkoutSchema = yup.object().shape({
  title: yup.string().required("required"),
  author: yup.string().required("required"),
  translator: yup.string(),
  publisher: yup.string().required("required"),
  category: yup.string().required("required"),
  price_original: yup.number().required("required"),
  price_discounted: yup.number().required("required"),
  stock: yup.number().required("required"),
  page: yup.number().required("required"),
  dimensions: yup.string().required("required"),
  description: yup.string().required("required"),
  image: yup.string().required("required"),
  create_at: yup.string(),
});

export default UpdateBook;
