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
const Loginform = ({ onSubmit, loading: externalLoading }) => {
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


  const handleLogin = async (e) => {
    e.preventDefault();
    SetError({});

    try {
      const scheme = Yup.object().shape({
        Email: Yup.string()
          .email("Enter valid Email")
          .required("Email is Required"),
        Password: Yup.string()
          .min(6, "Password must be 6 characters")
          .required("Password is required")
      });

      await scheme.validate(formData, { abortEarly: false });

      // Call the onSubmit function passed from parent
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      SetError(newErrors);
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
          className="w-full outline-none border h-[40px] rounded-lg px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="email"
          name="Email"
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        {/* <Error message={"Some message"}/> */}
        {Error.Email && <Errors message={Error.Email}/>}
      </CardContent>
      <CardContent className="w-full">
        <input
          className="w-full outline-none border h-[40px] rounded-lg px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="password"
          name="Password"
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        {/* <Error message={"Some Message"}/> */}
        {Error.Password && <Errors message={Error.Password}/>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin} disabled={externalLoading} className="w-full">
          {externalLoading ? <BeatLoader size={10} color="#ffffff" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Loginform;
