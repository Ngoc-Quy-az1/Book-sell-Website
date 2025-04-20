import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import Cookies from 'js.cookie'
export const mockLineData = () => {
  const [data, setData] = useState([]);
  useEffect (() => {
    getData();
  },[]);
    const getData = () => {
      const config = {"Authorization": `Bearer ${Cookies.get('authToken')}`};
      return fetch("http://localhost:8090/api/admin/revenue/by-category",{headers:config}) 
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