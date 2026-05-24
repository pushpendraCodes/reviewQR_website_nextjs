'use client';

import React from "react";
import { redirect } from 'next/navigation';;
import { useAppSelector } from "../store/hooks";
interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (!isAuthenticated) {
    return (() => { redirect('/auth/login'); return null; })();
  }
  return <>{children}</>;
};
export default ProtectedRoute;