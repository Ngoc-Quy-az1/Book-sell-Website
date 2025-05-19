import axios from "axios";
import Cookies from "js.cookie";
import { jwtDecode } from "jwt-decode";
const apiUrl = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(
  async (config) => {
  const authToken = config.headers.Authorization;
  //console.log(Cookies.get("authToken"))
  if  (authToken!=null)
    if (jwtDecode(authToken.slice(7)).exp<Date.now()/1000) {
      await 
        axios.post(
          `${apiUrl}/api/users/refresh-token`,
          {
        userId: Cookies.get("userId"),
        refreshToken: Cookies.get("refreshToken")
      }).then(res => {
        Cookies.set('authToken',res.data);
        //console.log("refreshed")
        config.headers.Authorization = "bearer "+ res.data;});  
  }
  return config
}
);