import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../../theme";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PaidIcon from '@mui/icons-material/Paid';
import PersonIcon from "@mui/icons-material/Person";
import Header from "../../../components/Admin/Header";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BarChart from "../../../components/Admin/BarChart";
import StatBox from "../../../components/Admin/StatBox";
import { useState, useEffect } from "react";
import "../../../CheckToken";
import Cookies from "js.cookie";
import axios from "axios";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [countUsers, setCountUsers] = useState();
  const [countBooks, setCountBooks] = useState();
  const [countSales, setCountSales] = useState();
  const [totalRevenue, setTotalRevenue] = useState();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const config = {
      headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
    };
    const users = await axios.get(`${apiUrl}/api/admin/users/count`, config);
    setCountUsers(users.data);

    const books = await axios.get(`${apiUrl}/api/books/all`, config);
    setCountBooks(books.data.length);

    const sales = await axios.get(`${apiUrl}/api/admin/orders/count`, config);
    setCountSales(sales.data);

    const revenue = await axios.get(`${apiUrl}/api/admin/revenue/total`, config);
    setTotalRevenue(revenue.data);
  };
const updateRowField = (id, field, value) => {
  setRows(prevRows =>
    prevRows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    )
  );
};
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>
      <Box
        display="grid"
        justifyContent="center"
        alignItems="center"
        gridTemplateColumns={isMobile ? "1fr" : "repeat(4, 1fr)"}
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Stat Boxes */}
        {[{
          title: countBooks,
          subtitle: "Books",
          icon: <MenuBookIcon sx={{ color: colors.greenAccent[600], fontSize: "30px" }} />
        }, {
          title: countUsers,
          subtitle: "Clients",
          icon: <PersonIcon sx={{ color: colors.greenAccent[600], fontSize: "30px" }} />
        }, {
          title: countSales,
          subtitle: "Sales Obtained",
          icon: <RequestQuoteIcon sx={{ color: colors.greenAccent[600], fontSize: "30px" }} />
        }, {
          title: Math.round(totalRevenue),
          subtitle: "Total Revenue",
          icon: <PaidIcon sx={{ color: colors.greenAccent[600], fontSize: "30px" }} />
        }].map((item, i) => (
          <Box
            key={i}
            gridColumn="span 1"
            height="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            alignContent="center"
          >
            <div>
              {item.icon}
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: colors.grey[100] }}
              >
                {item.title}
              </Typography>
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                {item.subtitle}
              </Typography>
            </div>
          </Box>
        ))}

        {/* Chart Row */}
        <Box
          gridColumn={isMobile ? "span 1" : "span 4"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
          >
            <Box mb={isMobile ? 2 : 0}>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Revenue Generated
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                {totalRevenue} VND
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <BarChart bar="5"/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
