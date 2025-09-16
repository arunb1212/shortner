import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Accrodian from "@/Components/Accrodian";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const[longurl,setLongurl]=useState()

    const navigate=useNavigate()
    const handleshortener=(e)=>{
   e.preventDefault()
if(longurl)navigate(`/login?createUrl=${longurl}`)
    }

  return (
    <div>
      <h1 className="my-[10px] text-3xl font-bold text-center sm:text-4xl md:text-5xl lg:text-6xl p-[10px]">
        The only link shortner you'll ever needed
      </h1>
      <div className="w-full flex  flex-col  justify-center items-center">
        <form onSubmit={handleshortener} className="flex justify-center flex-col sm:flex-row items-center w-full px-[30px] gap-[10px] mb-[20px] ">
          <input
            type="url"
            value={longurl}
            placeholder="Enter your link"
            className="w-2/4 border rounded-md border-white outline-none p-[10px]"
            onChange={(e)=>setLongurl(e.target.value)}
          />
          <Button type="submit">Shorten</Button>
        </form>
        <div className="w-full px-[30px] flex justify-center items-center">
          <img
            src="https://github.com/piyush-eon/url-shortener/blob/master/public/banner1.jpg?raw=true"
            alt=""
          />
        </div>

        <Accrodian />
      </div>
    </div>
  );
};

export default Home;
