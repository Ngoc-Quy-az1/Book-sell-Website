import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./scenes/admin/global/Topbar";
import Sidebar from "./scenes/admin/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Notification from "./scenes/admin/notification";
const Admin = () => {
  const [theme, colorMode] = useMode();
  const [notification, setNotification] = useState(false);
  const handleNotification = () => {
    setNotification(!notification);
  }
  return (
    <div>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        <Sidebar/>
          <main className="content" style={{position:'relative',zIndex:'1'}}>
              <Topbar handleNotification={handleNotification}/>
              <Outlet/>
              <Notification notification={notification} handleNotification={handleNotification}/>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </div>
  );
}

export default Admin;
