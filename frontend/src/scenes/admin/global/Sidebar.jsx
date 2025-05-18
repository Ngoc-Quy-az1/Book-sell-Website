import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ChatIcon from '@mui/icons-material/Chat';
import { ReceiptIcon } from "lucide-react";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={"/admin" + to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true); // default collapsed
  const [selected, setSelected] = useState("Dashboard");

  return (
    <>
      {/* Background Overlay */}
      {!isCollapsed && (
        <Box
          onClick={() => setIsCollapsed(true)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1100,
          }}
        />
      )}

      {/* Sidebar */}
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar
          collapsed={isCollapsed}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1200,
            width: isCollapsed ? "80px" : "250px",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                  <Typography variant="h3" color={colors.grey[100]}>
                    ADMIN
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item title="Dashboard" to="/" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>Management</Typography>
              <Item title="Manage Books" to="/booklist" icon={<MenuBookIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Manage Users" to="/manageUsers" icon={<ContactsOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Order Lists" to="/orderlist" icon={<ReceiptIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Create New User" to="/createUser" icon={<PersonAddIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Add Book" to="/addBook" icon={<BookmarkAddIcon />} selected={selected} setSelected={setSelected} />

              <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>Pages</Typography>
              <Item title="Chat" to="/chat" icon={<ChatIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Calendar" to="/calendar" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} />

              <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>Charts</Typography>
              <Item title="Revenue" to="/bar" icon={<BarChartOutlinedIcon />} selected={selected} setSelected={setSelected} />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </>
  );
};

export default Sidebar;
