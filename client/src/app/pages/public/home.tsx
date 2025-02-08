import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/loading-spinner.component";
import { useScrollToTop } from "../../common/hooks/use-scroll-to-top";
import TopNavbar from "../../components/top-navbar.component";
import { VIEWS } from "../../routes/routes";
import Footer from "../../components/footer.component";
import backgroundImage from "../../common/assets/images/home.png";
import useToken from "../../hooks/useToken";
import homeBannerImg from "../../common/assets/images/home_banner.png";

export default function Home() {
  useScrollToTop();
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  const { token } = useToken();

  useEffect(() => {
    if (token) {
      navigate(VIEWS.USER_DASHBOARD);
    }
  }, [token]);

  const parentDivStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <React.Fragment>
      <div
        className="flex flex-col min-h-screen p-5 lg:p-0"
        style={parentDivStyle}
      >
        <TopNavbar
          btnName={"Sign In"}
          btnAction={() => navigate(VIEWS.SIGN_IN)}
        />
        <div className="w-full flex flex-col md:flex-row justify-center items-center mt-10 min-h-screen">
          {/* Left side container */}
          <div className="w-full lg:w-1/2 lg:pl-12 xl:pl-24 h-auto flex justify-start items-center md:items-start flex-col">
            <h1
              className="text-center md:text-left text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-600 leading-normal lg:leading-snug mb-6 lg:mb-10"
              style={{ lineHeight: "1.5" }}
            >
              Discover Your Next Favorite
              <span className="text-white py-1 lg:py-2 px-4 bg-gray-500 hover:bg-[#59090c] rounded-xl my-2 ml-0 mr-2 inline-block">
                Movie, 
              </span>
              <span className="text-white py-1 lg:py-2 px-4 bg-gray-700 hover:bg-[#59090c] rounded-xl my-2 mx-2 inline-block">
                Series,
              </span>
              or
              <span className="text-white py-1 lg:py-2 px-4 bg-gray-800 hover:bg-[#59090c] rounded-xl my-2 mx-2 inline-block">
                Documentary
              </span>
              Today
            </h1>
            <h4 className="text-4xl font-bold text-gray-600">
              Explore the latest and greatest movies and TV shows.
              Find top-rated films, shows, and documentaries with ease 
              and add them to your personal collections.
            </h4>
            <button
              onClick={() => navigate(VIEWS.SIGN_UP)}
              type="button"
              className="bg-secondary-dark hover:bg-orange-400 text-white rounded-xl text-lg px-5 py-3 lg:py-4 lg:px-8 text-center font-semibold w-max lg:w-auto mt-4 lg:mt-8"
            >
              Start Exploring <i className="fa-solid fa-angle-right ml-2"></i>
            </button>
          </div>
          {/* Right side container */}
          <div className="w-full lg:w-1/2 lg:pl-12 xl:px-24 h-auto flex justify-start items-center md:items-start flex-col opacity-90">
            <img
              src={homeBannerImg}
              alt="MovieApp Banner"
              className="mt-20 lg:mt-0 rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
      <Footer />
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
