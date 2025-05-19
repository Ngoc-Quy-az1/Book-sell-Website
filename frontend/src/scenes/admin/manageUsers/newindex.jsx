import { Box, useTheme,Grid, Typography, IconButton,TextField,MenuItem } from "@mui/material";
import { tokens } from "../../../theme";
import React,{ useState, useEffect } from "react";
import Header from "../../../components/Admin/Header";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Notice from "../../../components/ErrorNotice";
import Cookies from "js.cookie";
import {
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import "../../../CheckToken";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// Function chính
const ManageUsers = () => {
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
  const [listUsers, getListUsers] = useState([]);
  useEffect(() => {
    getUser();
  },[])
  const getUser = async () =>{
    await axios.get(`${apiUrl}/api/admin/users`,{
      headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`}
    })
    .then(Response => {
      getListUsers(Response.data);
    })
  }

  //Xóa người dùng
  const handleDeleteUsers = (selectedRows) => {
    selectedRows.forEach(async UserId => {
    await axios.delete(`${apiUrl}/api/admin/deleteUsers/` + UserId,{
      headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`}
    })});
  }

  //Update người dùng
  const updateUsers = async (user) => {
    let res = "";
    
    await axios.put(`${apiUrl}/api/admin/updateUsers/` + user.id,user,{
      headers: {      
      'Authorization': `Bearer ${Cookies.get('authToken')}`
      },
    })
    .then((response) => {
      if (response.data!=undefined) {res="Updated Failed";  setError(true)}// this will be a string
      else {res="Account Successfully Updated"; setError(false)}
      setMessage(res); 
      showNotice();
    });
    return res;
  }
    //Cột của bảng
    const [ini, setIni] = useState(false);
    const [rows, setRows] = React.useState([]);
    useEffect(() => {
      ini ? 
        {} : setRows(listUsers);
    })
    const disableIni = () => {
      setIni(true);
    }
    const [rowModesModel, setRowModesModel] = React.useState({});
  
    const handleRowEditStop = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };
  
    const handleEditClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      disableIni();
    };
  
    const handleSaveClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
  
    const handleDeleteClick = (id) => () => {
      handleDeleteUsers([id]);
      setRows(rows.filter((row) => row.id !== id));
      disableIni();
    };
  
    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
  
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    };
  
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
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "full_name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      editable: true,
    },
    {
      field: "mail",
      headerName: "Email",
      flex: 1,
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      editable: true,
    },
    {
      field: "balance",
      headerName: "Balance",
      headerAlign: "left",
      align: "left",
      editable: true,
    },
    {
      field: "points",
      headerName: "Points",
      headerAlign: "left",
      align: "left",
      editable: true,
    },
    {
      field: "membershipLevel",
      headerName: "Membership Level",
      headerAlign: "left",
      align: "left",
      editable: true,
      type:'singleSelect',
      valueOptions: ['Silver', 'Gold', 'Platinum']
    },
    {
      field:"is_admin",
      headerName: "Access",
      headerAlign: "left",
      align: "left",
      editable: true,
      type:'singleSelect',
      valueGetter: (params) => {
        const res = (params === true || params === "Admin") ? "Admin" :  "Member";
        return res;
      },
      valueOptions: ["Admin","Member"],
    },
    {
      field: "actions",
      type: 'actions',
      headerName: 'actions',
      width: 80,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ]
      },
    }
  ];

  //Trả vềvề
  return (
    <Box m="20px">
      <Notice notice={notice} message={message} showNotice={showNotice} isError={error}/>
      <Header title="Manage Users" subtitle="" />
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
         <Grid container spacing={2}>
  {rows.map((user) => {
    const isEditing = rowModesModel[user.id]?.mode === GridRowModes.Edit;

    return (
      <Grid item xs={12} key={user.id}>
        <Box
          sx={{
            backgroundColor: colors.primary[400],
            color: 'white',
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
            width: '100%',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Editable fields or text */}
            <Grid item xs={12} sm={2}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Name"
                  variant="filled"
                  value={user.full_name}
                  onChange={(e) => updateRowField(user.id, "full_name", e.target.value)}
                />
              ) : (
                <Typography variant="body2"><strong>Name:</strong> {user.full_name}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={2}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Phone"
                  variant="filled"
                  value={user.phone}
                  onChange={(e) => updateRowField(user.id, "phone", e.target.value)}
                />
              ) : (
                <Typography variant="body2"><strong>Phone:</strong> {user.phone}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={2}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Email"
                  variant="filled"
                  value={user.mail}
                  onChange={(e) => updateRowField(user.id, "mail", e.target.value)}
                />
              ) : (
                <Typography variant="body2"><strong>Email:</strong> {user.mail}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={1}>
              <Typography variant="body2"><strong>ID:</strong> {user.id}</Typography>
            </Grid>

            <Grid item xs={12} sm={1}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Balance"
                  variant="filled"
                  value={user.balance}
                  onChange={(e) => updateRowField(user.id, "balance", e.target.value)}
                />
              ) : (
                <Typography variant="body2"><strong>Balance:</strong> {user.balance}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={1}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Points"
                  variant="filled"
                  value={user.points}
                  onChange={(e) => updateRowField(user.id, "points", e.target.value)}
                />
              ) : (
                <Typography variant="body2"><strong>Points:</strong> {user.points}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={1.5}>
              {isEditing ? (
                <TextField
                  fullWidth
                  select
                  label="Membership"
                  variant="filled"
                  value={user.membershipLevel}
                  onChange={(e) => updateRowField(user.id, "membershipLevel", e.target.value)}
                >
                  <MenuItem value="Silver">Silver</MenuItem>
                  <MenuItem value="Gold">Gold</MenuItem>
                  <MenuItem value="Platinum">Platinum</MenuItem>
                </TextField>
              ) : (
                <Typography variant="body2"><strong>Membership:</strong> {user.membershipLevel}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={1.5}>
              {isEditing ? (
                <TextField
                  fullWidth
                  select
                  label="Access"
                  variant="filled"
                  value={user.is_admin ? "Admin" : "Member"}
                  onChange={(e) => updateRowField(user.id, "is_admin", e.target.value === "Admin")}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Member">Member</MenuItem>
                </TextField>
              ) : (
                <Typography variant="body2"><strong>Access:</strong> {user.is_admin ? "Admin" : "Member"}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={3}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Address"
                  variant="filled"
                  value={user.address}
                  onChange={(e) => updateRowField(user.id, "address", e.target.value)}
                />
              ) : (
                <Typography variant="body2"><strong>Address:</strong> {user.address}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm="auto">
              <Box display="flex" justifyContent="flex-end">
                {isEditing ? (
                  <>
                    <IconButton onClick={handleSaveClick(user.id)}>
                      <SaveIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton onClick={handleCancelClick(user.id)}>
                      <CancelIcon sx={{ color: 'gray' }} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={handleEditClick(user.id)}>
                      <EditIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton onClick={handleDeleteClick(user.id)}>
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    );
  })}
</Grid>


      </Box>
    </Box>
  );
};

export default ManageUsers;
