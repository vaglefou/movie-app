import React, { useEffect, useState } from "react";
import { useAuth } from "../../common/providers/user.provider";
import LoadingSpinner from "../../components/loading-spinner.component";
import { toast, ToastContainer } from "react-toastify";
import { useScrollToTop } from "../../common/hooks/use-scroll-to-top";
import useToken from "../../hooks/useToken";
import {UserRoles} from "../../common/enums/user-roles.enum";
import { Paginator } from "primereact/paginator";
import { deleteUser, getAllUsers } from "../../services/user-api.service";
import defaultPlaceholder from "../../common/assets/images/default-user-avatar.png";
import { formatTimestamp } from "../../common/utils/date-format";
import PopupConfirmationComponent from "../../components/popup-confirmation.component";
import { Link } from "react-router-dom";
import { VIEWS } from "../../routes/routes";

export default function AllUsers() {
  useScrollToTop();
  const { token } = useToken();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<any | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [showNoContentMessage, setShowNoContentMessage] = useState<boolean>(false);
 

  // Handling the pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  

  //PrimeReact paginator handler
  const onPageChange = (event: any) => {
    const newPage = event.page + 1;
    const newPageSize = event.rows;
    setPageSize(newPageSize);
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = JSON.parse(localStorage.getItem("user") || "");
    if (accessToken && (user || storedUser)) {
      handleGetAllUsers(accessToken);
    }
    const timeoutId = setTimeout(
      () => {
        setShowNoContentMessage(true);
      },
      allUsers?.length === 0 ? 0 : 100
    );
    return () => clearTimeout(timeoutId);
  }, [currentPage, pageSize]);

  // Get all items

  const handleGetAllUsers = async (token: any) => {
    try {
      setIsLoading(true);
      // Calling to the API service
      const response = await getAllUsers(
        token,
        currentPage,
        pageSize,
        searchQuery
      );
      // Handling the response
      if (response.success) {
        setAllUsers(response?.data?.data?.items);
        setTotal(response?.data?.data?.pageInfo?.totalDocuments);
      } else {
        toast.error(response.error);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during form action:", error);
      setIsLoading(false);
    }
  };

  // Search 
  useEffect(() => {
    // Getting the token from the local storage
    const accessToken = localStorage.getItem("accessToken");

    // Stopping trigger this functionality when the page mount
    if (searchQuery.trim() === "") {
      handleGetAllUsers(accessToken);
    } else {
      const debounceSearch = setTimeout(() => {
        handleSearchCompanies(accessToken);
      }, 750);
      return () => clearTimeout(debounceSearch);
    }
  }, [searchQuery]); // Only run this effect when searchQuery changes

  const handleSearchCompanies = async (accessToken: any) => {
    try {
      setIsLoading(true);
      const response = await getAllUsers(
        accessToken,
        currentPage,
        pageSize,
        searchQuery
      );
      if (response.success) {
        setAllUsers(response?.data?.data?.items);
        setTotal(response?.data?.data?.pageInfo?.totalDocuments);
      } else {
        toast.error(response.error);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during form action:", error);
      setIsLoading(false);
    }
  };

  const handleSearchKeyUp = (e: any) => {
    setSearchQuery(e.target.value);
  };

  // View

  const [isItemViewOpen, setIsItemViewOpen] = useState<boolean>(false);

  const handleViewItem = async (item: any) => {
    setAllUsers(item);
    setIsItemViewOpen(true);
  };

  // Delete

  const [isConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);

  const handleConfirmDeleteItem = async (itemId: string) => {
    setUserId(itemId);
    setConfirmationOpen(true);
  };

  const handleDelete = async () => {
    try {
      setConfirmationOpen(false);
      setIsLoading(true);
      // Calling to the API service
      const response = await deleteUser(token, userId);
      // Handling the response
      if (response.success) {
        handleGetAllUsers(token);
        toast.success(response?.data?.message);
      } else {
        toast.error(response.error);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during form action:", error);
      setIsLoading(false);
    }
  };


  return (
    <React.Fragment>
      {user?.role !== UserRoles.ADMIN ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <h1 className="text-4xl font-bold text-red-500 mb-4">
              Access Denied
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              You do not have permission to view this page.
            </p>
            <Link
              to={VIEWS.USER_DASHBOARD}
              className="text-blue-500 hover:underline text-lg"
            >
              Go back to the homepage
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-5xl text-slate-700 font-bold">All Users</h1>
          <div className="w-full px-3 bg-slate-50 rounded-lg mt-10">
            <div
              className={` w-full h-14 mb-4 py-4 px-5 border-none rounded-lg  font-normal flex flex-row items-center justify-center`}
            >
              <i className={`fa-solid fa-magnifying-glass text-slate-400`}></i>
              <input
                className={`w-full ml-5 border-none outline-none bg-slate-50 text-slate-500`}
                type={"text"}
                name={"search_query"}
                placeholder={"Search Users"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onKeyUp={(e) => handleSearchKeyUp(e)}
              />
            </div>
          </div>
          {allUsers?.length > 0 ? (
            <div className="relative overflow-x-auto shadow-xl sm:rounded-lg mt-16">
              <table className="w-full text-xs lg:text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers?.map((item: any) => (
                    <tr
                      className="bg-white border-b hover:bg-gray-50"
                      key={item._id}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-row justify-start items-center">
                          <img
                            src={defaultPlaceholder}
                            alt={`${item.username}`}
                            className="rounded-full w-10 h-10 border-2 border-blue-300"
                          />
                          <div className="flex flex-col justify-center items-start ml-2">
                            <p className="font-bold text-slate-500">
                              {item?.username} 
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-sm">{item?.email}</td>
                      <td className="px-6 py-4">{item?.role}</td>
                      <td className="px-6 py-4">
                        {formatTimestamp(item?.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-start items-center">
                          {user?.role === UserRoles.ADMIN &&
                          item?.role !== UserRoles.ADMIN ? (
                            <button
                              className="rounded-xl bg-rose-400 hover:bg-rose-500 p-2 text-white font-bold w-10 h-10 mx-1"
                              onClick={() => handleConfirmDeleteItem(item?._id)}
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center w-full overflow-x-auto">
                <Paginator
                  first={(currentPage - 1) * pageSize}
                  rows={pageSize}
                  totalRecords={total || 0}
                  onPageChange={onPageChange}
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                />
              </div>
            </div>
          ) : showNoContentMessage ? (
            <div className="w-full flex flex-col justify-center items-center mt-24">
              <span className="rounded-full h-64 w-64 bg-slate-50 flex flex-col justify-center items-center text-slate-300">
                <i className="fa-solid fa-circle-info text-8xl text-slate-200"></i>
                <h1 className="text-slate-300 mt-5 text-xs">
                  No Companies available
                </h1>
              </span>
            </div>
          ) : null}

          {/* Delete pop up goes here */}
          <PopupConfirmationComponent
            popUpDisplay={isConfirmationOpen}
            handleClose={() => setConfirmationOpen(false)}
            handleOpen={() => setConfirmationOpen(true)}
            popUpTitle={"Warning"}
            popUpContent={"Are you sure want to delete this user?"}
            handleConfirm={() => handleDelete()}
          />

          {isLoading ? <LoadingSpinner /> : null}
          <ToastContainer />
        </>
      )}
    </React.Fragment>
  );
}
