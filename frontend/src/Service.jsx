import Cookies from "js.cookie";
import { jwtDecode } from "jwt-decode";
export const CheckToken = () => {
    if (Cookies.get('authToken'))
        if (jwtDecode(Cookies.get('authToken')).exp<Date.now()/1000)
            Cookies.remove('authToken');
    return Cookies.get('authToken');
}