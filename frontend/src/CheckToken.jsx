import axios from "axios";
import Cookies from "js.cookie";
import { jwtDecode } from "jwt-decode";

axios.interceptors.request.use(
  async (config) => {
  const authToken = config.headers.Authorization;
  if  (authToken!=null)
    if (jwtDecode(authToken.slice(7)).exp<Date.now()/1000) {
      await 
        axios.post(
          `http://localhost:8090/api/users/refresh-token`,
          {
        userId: Cookies.get("userId"),
        refreshToken: Cookies.get("refreshToken")
      }).then(res => {
        Cookies.set('authToken',res.data);
        config.headers.Authorization = "bearer "+ res.data;});  
  }
  console.log(config)
  return config
}
);