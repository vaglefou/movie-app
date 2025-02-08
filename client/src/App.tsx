import {  BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { VIEWS } from "./app/routes/routes";
import SignUp from "./app/pages/auth/sign-up";
import SignIn from "./app/pages/auth/sign-in";
import UserProtectedRoutes from "./app/middleware/user-protected-routes.middleware";
import DashboardLayout from "./app/pages/protected/dashboard-layout";
import Dashboard from "./app/pages/protected/dashboard";
import Home from "./app/pages/public/home";
import NotFound from "./app/components/not-found.component";
import Collections from "./app/pages/protected/collections";
import AllUsers from "./app/pages/protected/all-users";
import CollectionsItems from "./app/pages/protected/collections-movies";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes*/}
          <Route path={VIEWS.HOME} index element={<Home />} />
          <Route path={VIEWS.HOME_WITH_PREFIX} index element={<Home />} />
          <Route path={VIEWS.SIGN_UP} element={<SignUp />} />
          <Route path={VIEWS.SIGN_IN} element={<SignIn />} />
          {/* Protected routes*/}
          <Route path="/user" element={<UserProtectedRoutes />}>
            <Route
              path={VIEWS.USER_DASHBOARD_LAYOUT}
              element={<DashboardLayout />}
            >
              {/* When the user trying navigating  to the -> /user (index route of this nested routes) it will redirecting to the -> /user/dashboard*/}
              <Route index element={<Navigate to={VIEWS.USER_DASHBOARD} />} />
              {/* user protected other routes*/}
              <Route element={<Navigate to={VIEWS.USER_DASHBOARD} />} />
              <Route path={VIEWS.USER_DASHBOARD} element={<Dashboard />} />
              <Route path={VIEWS.USER_COLLECTIONS} element={<Collections />} />
              <Route path={VIEWS.USER_ALL_USERS} element={<AllUsers />} />
              <Route
                path={VIEWS.USER_COLLECTION_ITEMS}
                element={<CollectionsItems />}
              />
            </Route>
          </Route>
          <Route path="*" Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
