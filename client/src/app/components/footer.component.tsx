import React from "react";
import { Link } from "react-router-dom";
import { VIEWS } from "../routes/routes";
import logo from "../common/assets/images/logo_white.svg";

export default function Footer() {
  return (
    <React.Fragment>
      <footer className="bg-secondary-dark w-full">
        <div className="w-full max-w-screen-xl mx-auto p-1">
          <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-center">
            <div className="text-center">
              <Link
                to={VIEWS.HOME}
                className="text-2xl font-semibold whitespace-nowrap dark:text-white flex justify-center items-center"
              >
                <img src={logo} alt="" className="mx-auto sm:mx-0 h-8" />
              </Link>
              <span className="block text-sm text-gray-500 mt-1">
                © {new Date().getFullYear()}{" "}
                <Link
                  to={VIEWS.HOME}
                  className="hover:underline cursor-pointer"
                >
                  MovieApp
                </Link>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}
