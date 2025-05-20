import { Box, Button, TextField, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Notice from "../errorNotice/index";
import Header from "../../../components/Admin/Header";
import { useState } from "react";
import Cookies from "js.cookie";
import "../../../CheckToken";
import axios from "axios";

const BookForm = () => {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [notice, setNotice] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const showNotice = () => {
    setNotice(!notice);
    setTimeout(() => setNotice(), 3000);
  };

  const handleFormSubmit = (values) => {
    //console.log(values);
    createBook(values);
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
};
  const createBook = async (form) => {

    await axios.post(`${apiUrl}/api/books/add`, form, {
      headers: {
        Authorization: `Bearer ${Cookies.get("authToken")}`
      },
    })
      .then(() => {
        setMessage("Book Successfully Added");
        setError(false);
        showNotice();
        setImagePreview(null); // Reset preview on success
      })
      .catch((response) => {
        //console.log(response.response.data);
        setMessage(response.response.data);
        setError(true);
        showNotice();
      });
  };

  return (
    <Box m="20px">
      <Header title="ADD BOOK" subtitle="Create a New Book Entry" />
      <Notice notice={notice} message={message} showNotice={showNotice} isError={error} />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={bookSchema}
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
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="text"
                label="Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="text"
                label="Author"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.author}
                name="author"
                error={!!touched.author && !!errors.author}
                helperText={touched.author && errors.author}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="text"
                label="Translator"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.translator}
                name="translator"
                error={!!touched.translator && !!errors.translator}
                helperText={touched.translator && errors.translator}
                sx={{ gridColumn: "span 4" }}
              />              
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="text"
                label="Publisher"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.publisher}
                name="publisher"
                error={!!touched.publisher && !!errors.publisher}
                helperText={touched.publisher && errors.publisher}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="text"
                label="Category"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.category}
                name="category"
                error={!!touched.category && !!errors.category}
                helperText={touched.category && errors.category}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="number"
                label="Original Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price_original}
                name="price_original"
                error={!!touched.price_original && !!errors.price_original}
                helperText={touched.price_original && errors.price_original}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="number"
                label="Discounted Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price_discounted}
                name="price_discounted"
                error={!!touched.price_discounted && !!errors.price_discounted}
                helperText={touched.price_discounted && errors.price_discounted}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="number"
                label="Stock"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.stock}
                name="stock"
                error={!!touched.stock && !!errors.stock}
                helperText={touched.stock && errors.stock}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="number"
                label="Page"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.page}
                name="page"
                error={!!touched.page && !!errors.page}
                helperText={touched.page && errors.page}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="text"
                label="Dimensions (XxYxZ)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dimensions}
                name="dimensions"
                error={!!touched.dimensions && !!errors.dimensions}
                helperText={(touched.dimensions && errors.dimensions) || "Use format: 10x20x5"}
                sx={{ gridColumn: "span 2" }}
              />
              {/* File upload */}
              <Box sx={{ gridColumn: "span 4" }}>
                <input
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
                />
                {errors.image && touched.image && (
                    <div style={{ color: "red", marginTop: "5px" }}>{errors.image}</div>
                )}
                {imagePreview && (
                    <Box mt={2}>
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxHeight: "200px", borderRadius: "8px" }}
                    />
                    </Box>
                )}
                </Box>

              <TextField
                color={colors.grey[100]}
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                multiline
                minRows={4}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add Book
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};
const dimensionRegExp = /^\d+?x\d+?x\d+/;
const bookSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  author: yup.string().required("Author are required"),
  translator: yup.string(),
  publisher: yup.string().required("Publisher are required"),
  category: yup.string().required("Category is required"),
  price_original: yup.number().required("Original price is required").positive(),
  stock: yup.number().required("Stock is required").positive(),
  page: yup.number().required("Stock is required").positive(),
  price_discounted: yup.number().required("Discounted price is required").positive(),
  image: yup.mixed().required("Image is required"),
  description: yup.string().required("Description is required"),
  dimensions: yup
    .string()
    .required("Dimension is required")
    .matches(dimensionRegExp, "Format must be XxYxZ (e.g., 10x20x5)")
});
const date = new Date();
const initialValues = {
  title: "",
  author: "",
  translator: "",
  publisher:"",
  category: "",
  price_original: 0,
  price_discounted: 0,
  stock:0,
  page:0,
  dimensions: "",
  image: null,
  description: "",
  create_at:`${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`,
};

export default BookForm;
