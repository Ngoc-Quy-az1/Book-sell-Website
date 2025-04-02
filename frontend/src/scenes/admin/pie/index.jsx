import { Box } from "@mui/material";
import Header from "../../../components/Admin/Header";
import PieChart from "../../../components/Admin/PieChart";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh" minWidth="300px">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
