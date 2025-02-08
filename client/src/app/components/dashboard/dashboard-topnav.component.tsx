import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VIEWS } from "../../routes/routes";
import useToken from "../../hooks/useToken";
import { useAuth } from "../../common/providers/user.provider";
import { UserRoles } from "../../common/enums/user-roles.enum";
import defaultPlaceholder from "../../common/assets/images/user-placeholder.png";
import logo from "../../common/assets/images/logo_white.svg";
import logoColored from "../../common/assets/images/logo.svg";

const DashboardTopNavComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearToken } = useToken();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenMobileNavigation, setIsOpenMobileNavigation] =
    useState<boolean>(false);

  // Handling the active link
  const { pathname } = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const path = pathname.split("/")[2];
    setActiveLink(path);
  }, [pathname]);

  // Handling the click out side closing the pop up
  const dropDownRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        event.target &&
        !dropDownRef.current.contains(event.target as Node) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  // Handling the toggle drop down
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handling the sign out
  const handleSignOut = () => {
    clearToken();
    navigate(VIEWS.HOME);
  };

  return (
    <nav className="bg-slate-50 shadow-md h-20 px-4 flex items-center justify-between lg:justify-end fixed top-0 right-0 w-full z-30">
      <div
        className="lg:hidden flex flex-row justify-start items-center"
        id="navbar-sticky"
        onClick={() => setIsOpenMobileNavigation(!isOpenMobileNavigation)}
      >
        <i
          className={`${
            isOpenMobileNavigation ? "fa-solid fa-xmark" : "fa-solid fa-bars"
          } font-bold text-4xl text-slate-700`}
        />
        <img src={logoColored} alt="" className="w-32 h-auto ml-5" />
      </div>
      <div className="flex flex-row">
        <div className="hidden lg:flex flex-col justify-end text-right mr-5">
          <p className="font-semibold text-md text-gray-800">{`${user?.username}`}</p>
          <p className="font-medium text-sm text-gray-400">{user?.email}</p>
        </div>
        <div className="relative">
          <div
            className="flex flex-row justify-between items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <div
              className="bg-gray-400 text-white h-12 w-12 rounded-full border-2 border-indigo-300"
              style={{
                backgroundImage: `url(${defaultPlaceholder})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#f5f5f5",
              }}
            ></div>
            <i className="fa-solid fa-chevron-down ml-5"></i>
          </div>
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <ul
              className="absolute right-0 mt-1 bg-white border shadow-md rounded-lg font-semibold py-2"
              ref={dropDownRef}
            >
              <li
                className="py-2 px-8 hover:bg-orange-400 hover:text-white cursor-pointer flex flex-row items-center"
                onClick={() => {
                  toggleDropdown();
                  handleSignOut();
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket mr-4"></i>{" "}
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
      {/* Mobile responsive menu goes here */}
      {isOpenMobileNavigation && (
        <div className="lg:hidden w-full h-screen bg-secondary-dark mt-20 absolute top-0 left-0 overflow-hidden text-white z-50">
          <ul className="flex flex-col justify-between h-auto mt-10">
            <Link to={VIEWS.USER_DASHBOARD}>
              <li
                className={`px-6 py-4 hover:bg-orange-400 cursor-pointer mx-5 my-2 rounded-lg ${
                  activeLink === "dashboard" ? "bg-orange-400" : "bg-inherit"
                }`}
                onClick={() =>
                  setIsOpenMobileNavigation(!isOpenMobileNavigation)
                }
              >
                <i className="fa-solid fa-fire mr-2 text-xl"></i>
                Movies
              </li>
            </Link>
            <Link to={VIEWS.USER_COLLECTIONS}>
              <li
                className={`px-6 py-4 hover:bg-orange-400 cursor-pointer mx-5 my-2 rounded-lg ${
                  activeLink === "collections" ? "bg-orange-400" : "bg-inherit"
                }`}
                onClick={() =>
                  setIsOpenMobileNavigation(!isOpenMobileNavigation)
                }
              >
                <i className="fa-solid fa-fire mr-2 text-xl"></i>
                Collections
              </li>
            </Link>
            {user?.role !== UserRoles.ADMIN ? (
              <Link to={VIEWS.USER_ALL_USERS}>
                <li
                  className={`px-6 py-4 hover:bg-orange-400 cursor-pointer mx-5 my-2 rounded-lg ${
                    activeLink === "all-users" ? "bg-orange-400" : "bg-inherit"
                  }`}
                  onClick={() =>
                    setIsOpenMobileNavigation(!isOpenMobileNavigation)
                  }
                >
                  <i className="fa-solid fa-users mr-2 text-xl"></i>
                  All Users
                </li>
              </Link>
            ) : null}
            <li
              className={`px-6 py-4 hover:bg-orange-400 cursor-pointer mx-5 my-2 rounded-lg`}
              onClick={() => handleSignOut()}
            >
              <i className="fa-solid fa-arrow-right-from-bracket mr-2 text-xl"></i>
              Log out
            </li>
          </ul>
          <div className="flex flex-col justify-center items-start w-full">
            <div className="flex flex-col justify-center items-center px-5 w-full mt-5">
              <img
                src={logo}
                alt=""
                className="w-3/4 h-auto cursor-pointer"
                onClick={() => navigate(VIEWS.USER_DASHBOARD)}
              />
              <span className="block text-xs text-gray-400 text-center px-5 w-full mt-2">
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
        </div>
      )}
    </nav>
  );
};

export default DashboardTopNavComponent;
