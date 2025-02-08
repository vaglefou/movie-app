import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/loading-spinner.component";
import { useScrollToTop } from "../../common/hooks/use-scroll-to-top";
import TopNavbar from "../../components/top-navbar.component";
import InputField from "../../components/input-field.component";
import Button from "../../components/button.component";
import { VIEWS } from "../../routes/routes";
import Footer from "../../components/footer.component";
import { signInUser } from "../../services/auth-api.service";
import useToken from "../../hooks/useToken";

export default function SignIn() {
  useScrollToTop();
  const navigate = useNavigate();
  const { token, setToken, clearToken } = useToken();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [isLoading, setIsLoading] = useState(false);

  

  //If the token is available public pages are unavailable
  useEffect(() => {
    if (token) {
      navigate(VIEWS.USER_DASHBOARD);
    }
  }, [token]);

  const handleFormAction = async () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }
  
    if (!checkEmail.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
  
    if (!password) {
      toast.error("Please enter password");
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await signInUser(email, password);
  
      if (response.success) {
        setToken(response?.data?.data?.token);
        localStorage.setItem("user", JSON.stringify(response?.data?.data?.user));
  
        setEmail("");
        setPassword("");
        setIsLoading(false);
        navigate(VIEWS.USER_DASHBOARD);
        window.location.reload();
      } else {
        toast.error(response.error);
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleFormAction();
    }
  };
  

  return (
    <React.Fragment>
      <div className="flex flex-col min-h-screen">
        <TopNavbar
          btnName={"Sign Up"}
          btnAction={() => navigate(VIEWS.SIGN_UP)}
        />
        <div className="w-full flex flex-col md:flex-row justify-center items-center min-h-screen mt-20">
          <div className="w-full md:w-1/2 h-screen bg-white flex justify-center items-start">
            <div className="w-full bg-light p-5 rounded-xl mx-10 sm:mx-20 md:mx-5 lg:mx-20 xl:mx-32 mt-20">
              <h1 className="text-slate-800 font-bold text-center text-3xl my-14">
                Sign in
              </h1>
              <InputField
                icon="fa-solid fa-envelope"
                type="email"
                label="Email *"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                onKeyDown={handleKeyPress}
              />
              <InputField
                icon="fa-solid fa-lock"
                type="password"
                label="Password *"
                placeholder="Enter password"
                value={password}
                onChange={setPassword}
                onKeyDown={handleKeyPress}
              />
              <Button
                name={"Sign in with MovieApp"}
                handleAction={handleFormAction}
              />
              <p className="block text-gray-700 text-sm font-semibold text-center my-10">
                Don’t have an account?{" "}
                <Link
                  to={VIEWS.SIGN_UP}
                  className="text-blue-800 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
