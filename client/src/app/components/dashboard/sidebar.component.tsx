import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../common/assets/images/logo_white.svg";
import { VIEWS } from "../../routes/routes";
import { UserRoles } from "../../common/enums/user-roles.enum";
import { useAuth } from "../../common/providers/user.provider";

const SidebarComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handling the active link
  const { pathname } = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const path = pathname.split("/")[2];
    setActiveLink(path);
  }, [pathname]);



  return (
    <div className="hidden lg:block bg-secondary-dark text-white h-full min-h-screen w-72 py-4 fixed top-0 left-0 z-40 items-center">
      <div className="flex flex-col justify-center items-center mt-14 mb-16 px-10">
        <img
          src={logo}
          alt=""
          className="w-full h-auto cursor-pointer"
          onClick={() => navigate(VIEWS.USER_DASHBOARD)}
        />
        <hr className="border-1 border-slate-300 w-full mt-10 px-5" />
      </div>
      <ul className="flex flex-col justify-between h-auto">
        <Link to={VIEWS.USER_DASHBOARD}>
          <li
            className={`px-6 py-4 hover:bg-orange-400 hover:text-white cursor-pointer mx-5 my-2 rounded-lg ${
              activeLink === "dashboard"
                ? "bg-white text-purple-700"
                : "bg-inherit"
            }`}
          >
            <i className="fa-solid fa-video mr-2 text-xl"></i>
            Movies
          </li>
        </Link>
        <Link to={VIEWS.USER_COLLECTIONS}>
          <li
            className={`px-6 py-4 hover:bg-orange-400 hover:text-white cursor-pointer mx-5 my-2 rounded-lg ${
              activeLink === "collections"
                ? "bg-white text-purple-700"
                : "bg-inherit"
            }`}
          >
            <i className="fa-solid fa-fire mr-2 text-xl"></i>
            Collections
          </li>
        </Link>
        {user?.role === UserRoles.ADMIN ? (
          <Link to={VIEWS.USER_ALL_USERS}>
            <li
              className={`px-6 py-4 hover:bg-orange-400 hover:text-white cursor-pointer mx-5 my-2 rounded-lg ${
                activeLink === "all-users"
                  ? "bg-white text-purple-700"
                  : "bg-inherit"
              }`}
            >
              <i className="fa-solid fa-users mr-2 text-xl"></i>
              All Users
            </li>
          </Link>
        ) : null}
      </ul>
      <div className="flex flex-col justify-center items-start absolute bottom-10 w-full">
        <span className="block text-xs text-gray-400 text-center mt-5 sm:text-left px-5">
          © {new Date().getFullYear()}{" "}
          <Link
            to={VIEWS.USER_DASHBOARD}
            className="hover:underline cursor-pointer"
          >
            MovieApp
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SidebarComponent;
