import { Box } from "@mui/material";
import Header from "../../../components/Admin/Header";
import BarChart from "../../../components/Admin/BarChart";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Revenue Generated" />
      <Box height="75vh" minWidth="400px">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
