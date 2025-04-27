import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import React,{ useState, useEffect } from "react";
import Header from "../../../components/Admin/Header";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Notice from "../../../components/Notice";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import Cookies from "js.cookie"
const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}

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
  const getUser = () =>{
    fetch("http://localhost:8090/api/admin/users",{
      method:"GET",
      headers: config
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      getListUsers(Response);
    })
  }

  //Xóa người dùng
  const handleDeleteUsers = (selectedRows) => {
    selectedRows.forEach(UserId => {
    fetch("http://localhost:8090/api/admin/deleteUsers/" + UserId,{
      method:"DELETE",
      headers: config
    })});
  }

  //Update người dùng
  const updateUsers = (user) => {
    let res = "";
    
    fetch("http://localhost:8090/api/admin/updateUsers/" + user.id,{method:"PUT",
      headers: {      
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Cookies.get('authToken')}`
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
      console.log(str);
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
      width: 100,
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
        sx={{
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
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}/>
      </Box>
    </Box>
  );
};

export default ManageUsers;
