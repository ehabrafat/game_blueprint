"use client";
import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProbs {
  message: string;
}

export const FormSuccess = ({ message }: FormSuccessProbs) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/20 p-3 rounded-md flex items-center gap-x-2 text-emerald-500 text-sm">
      <FaCheckCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
