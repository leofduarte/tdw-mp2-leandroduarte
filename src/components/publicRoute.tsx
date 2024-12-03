import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: any) => state.auth.user);
  return user ? <Navigate to="/" /> : children;
};

export default PublicRoute;