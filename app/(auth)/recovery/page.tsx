"use client";
import { useUser } from "@/store/useProfile";

const Recovery = () => {
  const { user, loading } = useUser();
  if (loading) return <h2>LOADING...</h2>;
  if (user) return <h2>SIGNED IN</h2>;
  else return <h2>NOT AUTH</h2>;
};

export default Recovery;
