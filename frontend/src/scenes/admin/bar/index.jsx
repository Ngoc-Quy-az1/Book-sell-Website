import { Box } from "@mui/material";
import Header from "../../../components/Admin/Header";
import BarChart from "../../../components/Admin/BarChart";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Revenue Generated" />
      <Box height="75vh" sx={{style:"overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"}}>
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
