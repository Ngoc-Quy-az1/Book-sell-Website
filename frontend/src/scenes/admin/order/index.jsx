import { tokens } from "../../../theme";
import React,{ useState, useEffect } from "react";
import Header from "../../../components/Admin/Header";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Notice from "../../../components/ErrorNotice";
import { FormControl, InputLabel, Select, MenuItem, Box, useTheme } from "@mui/material";
import Cookies from "js.cookie";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import "../../../CheckToken";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// Function chính
const OrderList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

//Thông báo Update 
  const [notice, setNotice] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const showNotice = () => {
    setNotice(!notice);
    setTimeout(() => {setNotice()},3000)
  }

  //Lấy danh sách người dùng
  const [listOrders, setListOrders] = useState([]);
  const [userId, setUserId] = useState(14);
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    getOrder();
  },[userId])
  const getOrder = async () =>{
    await axios.get(`${apiUrl}/api/order/${userId}`,{
      headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`}
    })
    .then(Response => {
      //console.log(Response.data)
      setListOrders(Response.data.reverse());
    })
  }
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      })
      .then((Response) => {
        setUserList(Response.data.filter((user) => !user.is_admin));
      });
  }, []);

    //Cột của bảng
    const [rows, setRows] = React.useState([]);
    useEffect(() => {
      setRows(listOrders);
    },[listOrders])
    const [rowModesModel, setRowModesModel] = React.useState({});
  
  

  
    const processRowUpdate = (newRow,oldRow) => {
      newRow.is_admin = (newRow.is_admin === "Admin");
      const str = updateUsers(newRow);
      //console.log(str);
      if (str==="Updated Failed") return oldRow;
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    };
  
    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    //Hàng của bảng
  const columns = [
    { field: "orderId", headerName: "ID", flex: 0.5 },
    {
      field: "createdAt",
      headerName: "Create At",
      minWidth: 90,
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      minWidth: 70,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 80,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
  ];

  //Trả vềvề
  return (
    <Box m="20px">
      <Notice notice={notice} message={message} showNotice={showNotice} isError={error}/>
      <Header title="Order List" subtitle="" /><FormControl fullWidth sx={{ mt: 2, maxWidth: 400 }}>
  <InputLabel id="select-user-label">Select User</InputLabel>
  <Select
    InputLabelProps={{sx:{color:colors.primary[900]}}}
    labelId="select-user-label"
    id="selectUser"
    value={userId}
    label="Select User"
    onChange={(e) => {
      setUserId(e.target.value);
    }}
  >
    {userList.map((user) => (
      <MenuItem key={user.id} value={user.id}>
        {user.full_name} (ID: {user.id})
      </MenuItem>
    ))}
  </Select>
</FormControl>

      <Box
        m="40px 0 0 0"
        height="75vh"
        width="100%"
        sx={{
          overflowX: 'auto',
          "& .MuiDataGrid-root": {
            border: "none",
            zIndex: 0
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            maxHeight:"10%"
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid 
        sx={{
            display: 'grid',
            gridTemplateRows: 'auto 1f auto',
        }}
        rows={rows}
        getRowId={row => row.orderId}
        columns={columns}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}/>
      </Box>
    </Box>
  );
};

export default OrderList;
