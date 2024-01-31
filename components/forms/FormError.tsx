  "use client";
  import { FaExclamation } from "react-icons/fa";
  interface FormErrorProbs {
    message: string;
  }

  export const FormError = ({ message }: FormErrorProbs) => {
    if (!message) return null;
    return (
      <div className="bg-destructive/20 p-3 rounded-md flex items-center gap-x-2 text-destructive text-sm">
        <FaExclamation className="h-4 w-4" />
        <p>{message}</p>
      </div>
    );
  };
