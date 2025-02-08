import { Navigate, Outlet } from "react-router-dom";
import { VIEWS } from "../routes/routes";
import { decodeJwt } from "../common/utils/decode-jwt";
import { UserRoles } from "../common/enums/user-roles.enum";

const UserProtectedRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { role } = decodeJwt(accessToken);
  return accessToken &&
    (role === UserRoles.ADMIN ||
      role === UserRoles.USER) ? (
    <Outlet />
  ) : (
    <Navigate to={VIEWS.SIGN_IN} />
  );
};

export default UserProtectedRoutes;
