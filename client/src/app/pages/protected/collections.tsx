import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../common/providers/user.provider";
import FormInputField from "../../components/form-input.component";
import Button from "../../components/button.component";
import LoadingSpinner from "../../components/loading-spinner.component";
import { useScrollToTop } from "../../common/hooks/use-scroll-to-top";
import { useNavigate } from "react-router-dom";
import PopupConfirmationComponent from "../../components/popup-confirmation.component";
import useToken from "../../hooks/useToken";
import {  createCollection,  deleteCollection, getAllCollections } from "../../services/collection-api.service";
import { Paginator } from "primereact/paginator";
import {
  formatTimestamp } from "../../common/utils/date-format";
import FormPopupComponent from "../../components/form-popup.component";
import { VIEWS } from "../../routes/routes";

export default function Collections() {
  useScrollToTop();
  const navigate = useNavigate();
  const { token } = useToken();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<any | null>(null);
  const [eventId, setEventId] = useState<string>("");
  const [showNoContentMessage, setShowNoContentMessage] =
    useState<boolean>(false);

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
      handleGetAllCollections(accessToken);
    }
    const timeoutId = setTimeout(
      () => {
        setShowNoContentMessage(true);
      },
      collections?.length === 0 ? 0 : 100
    );
    return () => clearTimeout(timeoutId);
  }, [currentPage, pageSize]);

  // Get all

  const handleGetAllCollections = async (token: any) => {
    try {
      setIsLoading(true);
      const response = await getAllCollections(
        token,
        currentPage,
        pageSize,
        searchQuery
      );
      if (response.success) {
        setCollections(response?.data?.data?.items);
        setTotal(response?.data?.data?.pageInfo?.totalCollections);
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
      handleGetAllCollections(accessToken);
    } else {
      const debounceSearch = setTimeout(() => {
        handleSearchEvents(accessToken);
      }, 750);
      return () => clearTimeout(debounceSearch);
    }
  }, [searchQuery]); // Only run this effect when searchQuery changes

  const handleSearchEvents = async (accessToken: any) => {
    try {
      setIsLoading(true);
      const response = await getAllCollections(
        accessToken,
        currentPage,
        pageSize,
        searchQuery
      );
      if (response.success) {
        setCollections(response?.data?.data?.items);
        setTotal(response?.data?.data?.pageInfo?.totalCollections);
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

  const headers = [
    { label: "Name", field: "name" },
    { label: "Created At", field: "createdAt" },
  ];

  // Create // 

  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  // Clearing the form data when opening the create form
  const handleCreateItem = async () => {
    setIsAddFormOpen(!isAddFormOpen);
    setFormData({
      name: "",
    });
    setIsAddFormOpen(true);
  };

  //Handling the text input
  const handleInputChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle create form action
  const handleFormAction = async (e: any) => {
    e.preventDefault();
    const { name } = formData;

    if (name === "") {
      toast.error("Please enter name");
    } else {
      try {
        setIsLoading(true);

        // Create FormData object to handle file upload
        const formData = new FormData();

        // Append file only if it exists
        formData.append("name", name);

        // Calling to the API service
        const response = await createCollection(token, formData);

        // Handling the response
        if (response.success) {
          setFormData({
            name: "",
          });
          setIsAddFormOpen(false);
          handleGetAllCollections(token);
          window.scrollTo(0, 0);
          toast.success(response?.data?.message);
        } else {
          toast.error(response.error);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error during form action:", error);
        setIsLoading(false);
      }
    }
  };

  // View

  const handleViewItem = async (item: any) => {
    navigate(`${VIEWS.USER_COLLECTION_ITEMS}?id=${item?._id}`);
  };

  // Delete 

  const [isConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);

  const handleConfirmDeleteItem = async (itemId: string) => {
    setEventId(itemId);
    setConfirmationOpen(true);
  };

  const handleDelete = async () => {
    try {
      setConfirmationOpen(false);
      setIsLoading(true);
      // Calling to the API service
      const response = await deleteCollection(token, eventId);
      // Handling the response
      if (response.success) {
        handleGetAllCollections(token);
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
      <h1 className="text-5xl text-slate-700 font-bold">Collections</h1>
      <div className="w-full flex justify-end items-center">
        <button
          className="bg-secondary-dark hover:bg-orange-400 text-white font-normal py-2 px-4 rounded-xl cursor-pointer text-sm"
          onClick={() => handleCreateItem()}
        >
          Add Collection <i className="fa-solid fa-plus ml-2"></i>
        </button>
      </div>
      <div className="w-full px-3 bg-slate-50 rounded-lg mt-10">
        <div
          className={` w-full h-14 mb-4 py-4 px-5 border-none rounded-lg  font-normal flex flex-row items-center justify-center`}
        >
          <i className={`fa-solid fa-magnifying-glass text-slate-400`}></i>
          <input
            className={`w-full ml-5 border-none outline-none bg-slate-50 text-slate-500`}
            type={"text"}
            name={"search_query"}
            placeholder={"Search collections"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            onKeyUp={(e) => handleSearchKeyUp(e)}
          />
        </div>
      </div>
      {collections?.length > 0 ? (
        <div className="relative overflow-x-auto shadow-xl sm:rounded-lg mt-16">
          <table className="w-full text-xs lg:text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer"
                    key={header.field}
                  >
                    {header.label}
                  </th>
                ))}
                <th scope="col" className="px-6 py-3">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {collections?.map((item: any) => (
                <tr
                  className="bg-white border-b hover:bg-gray-50"
                  key={item._id}
                >
                  <td className="px-6 py-4">
                    <h1 className="font-bold text-sm">{item?.name}</h1>
                  </td>
                  <td className="px-6 py-4">
                    {formatTimestamp(item?.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-start items-center">
                      <button
                        className="rounded-xl bg-rose-400 hover:bg-rose-500 p-2 text-white font-bold w-10 h-10 mx-1"
                        onClick={() => handleConfirmDeleteItem(item?._id)}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                      <button
                        className="rounded-xl bg-indigo-400 hover:bg-indigo-500 p-2 text-white font-bold w-10 h-10 mr-1"
                        onClick={() => handleViewItem(item)}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
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
              No collection available
            </h1>
          </span>
        </div>
      ) : null}

      {/* Create form goes here */}
      <FormPopupComponent
        popUpDisplay={isAddFormOpen}
        handleClose={() => setIsAddFormOpen(false)}
        handleOpen={() => setIsAddFormOpen(true)}
        popUpTitle={"Add Collection"}
      >
        <form className="w-full bg-slate-100 p-5 rounded-xl my-10">
          <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-3">
              <FormInputField
                icon="fa-solid fa-envelope"
                type="text"
                label="Name *"
                placeholder="Enter collection name"
                name="name"
                value={formData.name}
                onChange={(data: { name: string; value: any }) =>
                  handleInputChange(data.name, data.value)
                }
              />
            </div>
            <div className="w-full px-3 mb-6">
              <Button name={"Submit"} handleAction={handleFormAction} />
            </div>
          </div>
        </form>
      </FormPopupComponent>

      {/* Delete pop up goes here */}
      <PopupConfirmationComponent
        popUpDisplay={isConfirmationOpen}
        handleClose={() => setConfirmationOpen(false)}
        handleOpen={() => setConfirmationOpen(true)}
        popUpTitle={"Warning"}
        popUpContent={"Are you sure want to delete this collection?"}
        handleConfirm={() => handleDelete()}
      />

      <div className="h-32"></div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
