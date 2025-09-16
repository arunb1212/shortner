import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Yup from "yup"
import { Button } from "./button";
import { BeatLoader } from "react-spinners";
import Errors from "../Errors";
// import { validators } from "tailwind-merge";
const Loginform = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [Error,SetError]=useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleLogin= async()=>{
     SetError([])

     try {
      const scheme=Yup.object().shape({
        Email:Yup.string()
        .email("Enter valid Email")
        .required("Email is Required"),
        Password:Yup.string()
        .min(6,"Password must be 6 charecter")
        .required("password is required")

        
      })

      await scheme.validate(formData,{abortEarly:false})
     } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
      newErrors [err.path] = err.message;
      });
      SetError (newErrors);
     }
  }
  console.log(formData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login If you have one</CardDescription>
        {/* <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent className="w-full">
        <input
          className="w-full outline-none border h-[30px] rounded-[5px] px-[10px] border-white "
          type="email"
          name="Email"
          onChange={handleChange}
          placeholder="Enter Your email Id"
          required
        />
        {/* <Error message={"Some message"}/> */}
        {Error.Email && <Errors message={Error.Email}/>}
      </CardContent>
      <CardContent className="w-full">
        <input
          className="w-full outline-none border h-[30px] rounded-[5px] px-[10px] border-white "
          type="password"
          name="Password"
          onChange={handleChange}
          placeholder="Enter Your Password"
          required
        />
        {/* <Error message={"Some Message"}/> */}
        {Error.Password && <Errors message={Error.Password}/>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          {"Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Loginform;
