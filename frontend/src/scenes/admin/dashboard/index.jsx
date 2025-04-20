import { Box, Typography, useTheme, TextField } from "@mui/material";
import { tokens } from "../../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PaidIcon from '@mui/icons-material/Paid';
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import Header from "../../../components/Admin/Header";
import LineChart from "../../../components/Admin/LineChart";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BarChart from "../../../components/Admin/BarChart";
import StatBox from "../../../components/Admin/StatBox";
import ProgressCircle from "../../../components/Admin/ProgressCircle";
import { useState,useEffect } from "react";
import Cookies from 'js.cookie';
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [countUsers, getCountUsers] = useState();
  useEffect(() => {
    handleCountUser();
  },[])
  const handleCountUser = () =>{
    
    fetch("http://localhost:8090/api/admin/users/count",{
      method:"GET",
      headers:auth
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      getCountUsers(Response);
    })
  }  
  const [countBooks, getCountBooks] = useState();
  useEffect(() => {
    handleCountBook();
  })
  const handleCountBook = () =>{
    
    fetch("http://localhost:8090/api/books/all",{
      method:"GET",
      headers:auth
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      getCountBooks(Response.length);
    })
  }  
  

  const [countSales, getCountSales] = useState();
  useEffect(() => {
    handleCountSales();
  },[])
  const handleCountSales = () =>{
    
    fetch("http://localhost:8090/api/admin/orders/count",{
      method:"GET",
      headers:auth
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      getCountSales(Response);
    })
  }  
  
  const [totalRevenue, getTotalRevenue] = useState();
  useEffect(() => {
    handleTotalRevenue();
  },[])
  const handleTotalRevenue = () =>{
    
    fetch("http://localhost:8090/api/admin/revenue/total",{
      method:"GET",
      headers:auth
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      getTotalRevenue(Response);
    })
  }  
  const [message, getMessage] = useState();
  useEffect(() => {
    handleMessage();
  },[])
  const handleMessage = () =>{
    
    fetch("http://localhost:8090/api/admin/revenue/total",{
      method:"GET",
      headers:auth
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      getMessage(Response);
    })
  }  
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />


      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(15,minmax(10px,1fr))"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={countBooks}
            subtitle="Books"
            progress="0.75"
            increase="+14%"
            icon={
              <MenuBookIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={countUsers}
            subtitle="Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={countSales}
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <RequestQuoteIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={Math.round(totalRevenue)}
            subtitle="Total Revenue"
            progress="0.80"
            increase="+43%"
            icon={
              <PaidIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={message}
            subtitle="total Messages"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 15"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          zIndex={-1}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {(totalRevenue*1000).toLocaleString()} Coins
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <BarChart isDashboard={true}/>
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          <TextField
                          fullWidth
                          variant="filled"
                          type="text"
                          label="First Name"
                          name="firstName"
                          sx={{ gridColumn: "span 2" ,
                            position: 'relative',
                            zIndex: 0
                          }}
                        />
          {/*mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))*/}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 5"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
