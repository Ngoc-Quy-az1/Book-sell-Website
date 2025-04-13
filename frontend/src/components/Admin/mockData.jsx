import { tokens } from "../../theme";
import { useEffect, useState } from "react";
export const mockLineData = () => {
  const [data, setData] = useState([]);
  useEffect (() => {
    getData();
  },[]);
    const getData = () => {
      return fetch("http://localhost:8090/api/admin/revenue/by-category") 
      .then((response) => {
        return response.json();
      }).then((data) => {    
        setData([{"id": "jaan",
          "color": tokens("dark").greenAccent[500],
          "data": data.map((data) => 
          {return {x:data.category, y:data.totalRevenue}})
          
        }]) ;
        console.log(data);
      });
    }
      console.log(data);
      return data;
}