import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VIEWS } from "../routes/routes";
import logo from "../common/assets/images/logo_white.svg";

export default function TopNavbarComponent(props: {
  btnName?: string;
  btnAction?: any;
}) {
  // Handling the active link
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [isOpenMobileNavigation, setIsOpenMobileNavigation] =
    useState<boolean>(false);

  useEffect(() => {
    const path = pathname.split("/")[1];
    setActiveLink(path);
  }, [pathname]);

  // Handling the getting the token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
    }
  }, []);

  return (
    <React.Fragment>
      <nav className="fixed top-0 left-0 z-50 w-full bg-secondary-dark shadow-sm">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
          <Link to={VIEWS.HOME} className="flex items-center">
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
              <img src={logo} alt="" className="mx-auto sm:mx-0 h-10" />{" "}
            </span>
          </Link>
          <div className="flex md:order-2">
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-bold flex flex-col p-4 md:p-0 mt-4 border md:flex-row md:space-x-8 md:mt-0 md:border-0 md:mr-8">
                <li>
                  <Link
                    to={VIEWS.HOME}
                    className={`block py-2 pl-2 pr-4 ${
                      activeLink === ""
                        ? "underline text-white underline-offset-4"
                        : "text-white hover:text-slate-100"
                    }`}
                  >
                    Home
                  </Link>
                </li>
              </ul>
            </div>
            <button
              onClick={props.btnAction}
              type="button"
              className="hidden md:flex flex-row justify-start items-center text-slate-800 hover:text-slate-50 bg-white hover:bg-orange-400  rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 font-semibold"
            >
              {props.btnName}
            </button>
          </div>
          <div
            className="md:hidden"
            id="navbar-sticky"
            onClick={() => setIsOpenMobileNavigation(!isOpenMobileNavigation)}
          >
            <i
              className={`${
                isOpenMobileNavigation
                  ? "fa-solid fa-xmark"
                  : "fa-solid fa-bars"
              } font-bold text-4xl text-white mr-5`}
            />
          </div>
        </div>
        {isOpenMobileNavigation && (
          <div className="md:hidden w-full h-screen bg-secondary-dark mt-20 absolute top-0 overflow-hidden">
            <ul className="flex flex-col justify-start items-center w-full h-full mt-20">
              <li>
                <Link
                  to={VIEWS.HOME}
                  className={`block py-8 pl-2 pr-4 text-4xl font-semibold ${
                    activeLink === ""
                      ? "underline text-white underline-offset-4"
                      : "text-white hover:text-slate-100"
                  }`}
                >
                  Home
                </Link>
              </li>
              <div className="w-full flex flex-row justify-center items-center">
                <button
                  onClick={() => navigate(VIEWS.SIGN_IN)}
                  type="button"
                  className="mt-20 bg-white hover:bg-secondary-dark text-purple-600 rounded-lg text-lg px-4 py-2 text-center mr-3 md:mr-0 font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate(VIEWS.SIGN_UP)}
                  type="button"
                  className="mt-20 bg-white hover:bg-secondary-dark text-purple-600 rounded-lg text-lg px-4 py-2 text-center mr-3 md:mr-0 font-semibold"
                >
                  Sign Up
                </button>
              </div>
            </ul>
          </div>
        )}
      </nav>
    </React.Fragment>
  );
}
