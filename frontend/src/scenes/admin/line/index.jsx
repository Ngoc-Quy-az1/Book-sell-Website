import { Box } from "@mui/material";
import Header from "../../../components/Admin/Header";
import LineChart from "../../../components/Admin/LineChart";

const Line = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh" minWidth="400px">
        <LineChart/>
      </Box>
    </Box>
  );
};

export default Line;
