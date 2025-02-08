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
import { signUpUser } from "../../services/auth-api.service";
import useToken from "../../hooks/useToken";

export default function SignUp() {
  useScrollToTop();
  const navigate = useNavigate();
  const { token, setToken, clearToken } = useToken();
  const [username, setUsername] = useState("");
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


  //Sign up form error handling
  const handleFormAction = async () => {
    if (email === "") {
      toast.error("Please enter email");
    } else if (!checkEmail.test(email)) {
      toast.error("Please enter valid email");
    } else if (username === "") {
      toast.error("Please enter usernmae");
    } else if (password === "") {
      toast.error("Please enter password");
    } else {
      try {
        setIsLoading(true);

        const response = await signUpUser(username,  email, password);
        if (response.success) {
          setUsername("");
          setEmail("");
          setPassword("");
          setIsLoading(false);
          toast.success(response.data?.message);
          setTimeout(() => {
            navigate(`${VIEWS.USER_DASHBOARD}`);
          }, 750);
        } else {
          setIsLoading(false);
          toast.error(response.error);
        }
      } catch (error: any) {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleFormAction();
    }
  };

  //Sign up form
  return (
    <React.Fragment>
      <div className="flex flex-col min-h-screen">
        <TopNavbar
          btnName={"Sign In"}
          btnAction={() => navigate(VIEWS.SIGN_IN)}
        />
        <div className="w-full flex flex-col md:flex-row justify-center items-center min-h-screen mt-20">
          <div className="w-full md:w-1/2 h-full bg-white flex justify-center items-start">
            <div className="w-full bg-light p-5 rounded-xl mx-10 sm:mx-20 md:mx-5 lg:mx-20 xl:mx-32">
              <h1 className="text-slate-800 font-bold text-center text-3xl mt-4 mb-6">
                Create account
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
                icon="fa-solid fa-user-large"
                type="text"
                label="User name *"
                placeholder="Enter your username"
                value={username}
                onChange={setUsername}
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
                name={"Sign up to MovieApp"}
                handleAction={handleFormAction}
              />
              <p className="block text-gray-700 text-sm font-semibold text-center mt-5 mb-4">
                Already have an account?{" "}
                <Link
                  to={VIEWS.SIGN_IN}
                  className="text-blue-800 hover:underline"
                >
                  Sign in
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
