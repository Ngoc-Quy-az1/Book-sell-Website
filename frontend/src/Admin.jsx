import { useState } from "react";
import { BrowserRouter as Router,Routes, Route, Outlet } from "react-router-dom";
import Topbar from "./scenes/admin/global/Topbar";
import Sidebar from "./scenes/admin/global/Sidebar";
import Dashboard from "./scenes/admin/dashboard";
import Team from "./scenes/admin/team";
import Invoices from "./scenes/admin/invoices";
import Contacts from "./scenes/admin/contacts";
import Bar from "./scenes/admin/bar";
import Form from "./scenes/admin/form";
import Line from "./scenes/admin/line";
import Pie from "./scenes/admin/pie";
import FAQ from "./scenes/admin/faq";
import Geography from "./scenes/admin/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/admin/calendar/calendar";
const Admin = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        <Router>
          
        <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes render>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
          </Router>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </div>
  );
}

export default Admin;
