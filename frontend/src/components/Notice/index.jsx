import React, { useRef } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Notice = ({notice, showNotice, message, isError}) => {
    const ref = useRef();
    window.addEventListener("click", (e) => {
    if (e.target === ref.current) {
        showNotice();
    }
    });
      
    return <>{notice && (
        <div ref={ref} className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md rounded-md w-[350px] h-[250px] bg-white dark:bg-gray-900"
            >
                
                <div className="fixed w-[350px]"></div>
                    {isError ? <ErrorIcon sx={{fontSize: "150px", display:"block", margin:"auto" }}/>
                    : <CheckCircleIcon sx={{fontSize: "150px", display:"block", margin:"auto" }}/>
                    }
                <div/>
                <div className="fixed top-2/3 w-[350px]">
                <div className="rounded-xl flex flex-col gap-5 text-center text-2xl">
                    <p>{message}</p>
                </div>
                </div>
            </div>
        </div>
    )}</>
}
export default Notice;