import React, { useState } from "react";
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
          .email("Enter a valid email address")
          .required("Email is required"),
        Password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        ConfirmPassword: Yup.string()
          .oneOf([Yup.ref('Password'), null], 'Passwords must match')
          .required("Confirm password is required")
      });

      await scheme.validate(formData, { abortEarly: false });

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700">Email Address</label>
        <input
          className="w-full outline-none border h-[42px] bg-zinc-50 border-zinc-200 rounded-xl px-4 text-xs font-semibold placeholder-zinc-400 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition-all"
          type="email"
          name="Email"
          onChange={handleChange}
          placeholder="name@company.com"
          required
        />
        {Error.Email && <Errors message={Error.Email} />}
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700">Password</label>
        <input
          className="w-full outline-none border h-[42px] bg-zinc-50 border-zinc-200 rounded-xl px-4 text-xs font-semibold placeholder-zinc-400 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition-all"
          type="password"
          name="Password"
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        {Error.Password && <Errors message={Error.Password} />}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700">Confirm Password</label>
        <input
          className="w-full outline-none border h-[42px] bg-zinc-50 border-zinc-200 rounded-xl px-4 text-xs font-semibold placeholder-zinc-400 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition-all"
          type="password"
          name="ConfirmPassword"
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        {Error.ConfirmPassword && <Errors message={Error.ConfirmPassword} />}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-[42px] mt-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all disabled:opacity-50 shadow-premium"
      >
        {loading ? <BeatLoader size={8} color="#ffffff" /> : "Create Account"}
      </button>
    </form>
  );
};

export default Signupform;
