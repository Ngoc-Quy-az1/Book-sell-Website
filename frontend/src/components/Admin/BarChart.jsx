import { useTheme, useMediaQuery } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import Cookies from "js.cookie";
import axios from "axios";

const BarChart = ({bar}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:1000px)");
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/revenue/by-category`, {
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      });
      setData(response.data.slice(0, bar));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["totalRevenue"]}
      indexBy="category"
      margin={{
        top: 50,
        right: isMobile ? 20 : 130,
        bottom: isMobile ? 100 : 70,
        left: 60,
      }}
      padding={isMobile ? 0.2 : 0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: isMobile ? -30 : -15,
        legend: "Category",
        legendPosition: "middle",
        legendOffset: isMobile ? 70 : 45,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      tooltip={e => {
        return (
            <div
                style={{
                    background: colors.primary[900],
                    padding: '9px 12px',
                    color: colors.primary[100],
                }}
            >
                <div>{`Total Revenue: ${e.formattedValue} `}</div>
            </div>
        )}}
      role="application"
      barAriaLabel={function (e) {
        return `${e.id}: ${e.formattedValue} in category: ${e.indexValue}`;
      }}
    />
  );
};

export default BarChart;
