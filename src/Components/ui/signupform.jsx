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
import * as Yup from "yup";
import { Button } from "./button";
import { BeatLoader } from "react-spinners";
import Errors from "../Errors";

const Signupform = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [Error, SetError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    SetError({});

    try {
      const scheme = Yup.object().shape({
        Email: Yup.string()
          .email("Enter valid Email")
          .required("Email is Required"),
        Password: Yup.string()
          .min(6, "Password must be 6 characters")
          .required("Password is required"),
        ConfirmPassword: Yup.string()
          .oneOf([Yup.ref('Password'), null], 'Passwords must match')
          .required("Confirm password is required")
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className="w-full outline-none border h-[40px] rounded-lg px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="email"
              name="Email"
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            {Error.Email && <Errors message={Error.Email} />}
          </div>

          <div>
            <input
              className="w-full outline-none border h-[40px] rounded-lg px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="password"
              name="Password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {Error.Password && <Errors message={Error.Password} />}
          </div>

          <div>
            <input
              className="w-full outline-none border h-[40px] rounded-lg px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="password"
              name="ConfirmPassword"
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            {Error.ConfirmPassword && <Errors message={Error.ConfirmPassword} />}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <BeatLoader size={10} color="#ffffff" /> : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signupform;
