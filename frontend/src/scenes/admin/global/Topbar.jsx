import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useRef, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Cookies from "js.cookie"
import "../../../CheckToken";
import { Link } from "react-router-dom";
import axios from "axios";

const Topbar = ({handleNotification}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [showOption, setShowOption] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleShowOption = () => {
    setShowOption(!showOption);
  }
  const handleSignOut = async () =>{
    await axios.post(`${apiUrl}/api/users/logout/`+Cookies.get("userId"),
      {token: `${Cookies.get('authToken')}`},
      {     
      headers: {      
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
        }
    }) .then((data) => {
      //console.log(data);
      Cookies.remove('authToken');
      location.replace('/');
    });
  }
  const ref = useRef();
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowOption(false); 
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  return (
    <div style={{position:"sticky", top:"0"}}>
    <Box backgroundColor={colors.primary[400]} display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[900]}
        borderRadius="3px"
      >
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleNotification}>
          <NotificationsOutlinedIcon />
        </IconButton>
        {/* <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}
        <IconButton onClick={handleShowOption}>
          <PersonOutlinedIcon />
          <div className="absolute -left-20 z-50 w-[100px] top-10 rounded-md bg-white p-2 border" hidden={!showOption}
          ref={ref}
          style={{backgroundColor:colors.primary[400], textColor:colors.primary[100], borderColor:colors.primary[300], fontSize:"15px" }}>
                    <ul className="space-y-3">
                        <li >
                          <Link
                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                            to="../"
                          >
                            Home Page

                          </Link>
                          <a
                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                            onClick={handleSignOut}
                          >
                            Log Out
                          </a>
                        </li>
                    </ul>
                  </div>
        </IconButton>
      </Box>
    </Box>
    </div>
  );
};

export default Topbar;
