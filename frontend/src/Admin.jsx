import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./scenes/admin/global/Topbar";
import Sidebar from "./scenes/admin/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ChatButton from "./components/ChatButton/ChatButton"
import Cookies from 'js.cookie'

const Admin = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <div>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        <Sidebar isSidebar={isSidebar}/>
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Outlet/>
          </main>
          <ChatButton/>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </div>
  );
}

export default Admin;
