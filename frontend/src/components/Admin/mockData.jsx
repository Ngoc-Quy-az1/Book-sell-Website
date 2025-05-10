import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import Cookies from 'js.cookie'
export const mockLineData = () => {
  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect (() => {
    getData();
  },[]);
    const getData = () => {
      const config = {"Authorization": `Bearer ${Cookies.get('authToken')}`};
      return fetch(`${apiUrl}/api/admin/revenue/by-category`,{headers:config}) 
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