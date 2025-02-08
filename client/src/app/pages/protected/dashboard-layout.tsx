import React from "react";
import { Outlet } from "react-router-dom";
import SidebarComponent from "../../components/dashboard/sidebar.component";
import DashboardTopNavComponent from "../../components/dashboard/dashboard-topnav.component";

export default function UserDashboardLayout() {
  return (
    <React.Fragment>
      <div className="flex">
        <SidebarComponent />
        <div className="flex-1 lg:ml-72">
          <DashboardTopNavComponent />
          <div className="px-5 py-20 lg:p-20 mt-14">
            <div className="h-screen bg-white">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
