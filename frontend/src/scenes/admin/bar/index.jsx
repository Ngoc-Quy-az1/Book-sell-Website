import { Box } from "@mui/material";
import Header from "../../../components/Admin/Header";
import BarChart from "../../../components/Admin/BarChart";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Revenue Generated" />
      <Box className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <Box height="70vh" minWidth="800px">
        <BarChart/>
        </Box>
      </Box>
    </Box>
  );
};

export default Bar;
