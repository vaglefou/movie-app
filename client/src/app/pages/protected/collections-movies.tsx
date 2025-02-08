import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../common/providers/user.provider";
import FormInputField from "../../components/form-input.component";
import Button from "../../components/button.component";
import LoadingSpinner from "../../components/loading-spinner.component";
import { useScrollToTop } from "../../common/hooks/use-scroll-to-top";
import PopupConfirmationComponent from "../../components/popup-confirmation.component";
import useToken from "../../hooks/useToken";
import {
  createCollection, getAllCollections, getCollectionById } from "../../services/collection-api.service";
import { Paginator } from "primereact/paginator";
import FormPopupComponent from "../../components/form-popup.component";
import { useLocation } from "react-router-dom";
import {  deleteMovieToCollection, getAllMoviesInCollections} from "../../services/user-collection-api.service";
import defaultMoviePlaceHolder from "../../common/assets/images/default-movie.png";

export default function CollectionsItems() {
  useScrollToTop();;

  // Getting the id from the URL params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const collectionId: string = searchParams.get("id") ?? "";

  const { token } = useToken();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<any | null>(null);
  const [showNoContentMessage, setShowNoContentMessage] =
    useState<boolean>(false);

  // Handling the pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
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
    if (collectionId && accessToken && (user || storedUser)) {
      handleGetCollectionDetails(accessToken);
    }
  }, [collectionId]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = JSON.parse(localStorage.getItem("user") || "");
    if (accessToken && (user || storedUser)) {
      handleGetAllMoviesInCollection(accessToken);
    }
    const timeoutId = setTimeout(
      () => {
        setShowNoContentMessage(true);
      },
      collections?.length === 0 ? 0 : 100
    );
    return () => clearTimeout(timeoutId);
  }, [currentPage, pageSize]);

  // Get item by Id
  const [collection, setCollection] = useState<any | null>(null);

  const handleGetCollectionDetails = async (token: any) => {
    try {
      setIsLoading(true);
      if (collectionId) {
        const response = await getCollectionById(token, collectionId);
        if (response.success) {
          setCollection(response?.data?.data);
        } else {
          toast.error(response.error);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error during form action:", error);
      setIsLoading(false);
    }
  };

  // Get all

  const handleGetAllMoviesInCollection = async (token: any) => {
    try {
      setIsLoading(true);
      const response = await getAllMoviesInCollections(
        token,
        currentPage,
        pageSize,
        searchQuery,
        collectionId
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
      handleGetAllMoviesInCollection(accessToken);
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

  // Create
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
          handleGetAllMoviesInCollection(token);
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

  // Delete 
  const [isConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [userCollectionMovieId, setUserCollectionMovieId] =
    useState<string>("");

  const handleConfirmDeleteItem = async (userCollectionMovieId: any) => {
    setUserCollectionMovieId(userCollectionMovieId);
    setConfirmationOpen(true);
  };

  const handleDelete = async () => {
    try {
      setConfirmationOpen(false);
      setIsLoading(true);
      // Calling to the API service
      const response = await deleteMovieToCollection(
        token,
        collectionId,
        userCollectionMovieId
      );
      // Handling the response
      if (response.success) {
        handleGetAllMoviesInCollection(token);
        setUserCollectionMovieId("");
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
      <span className="flex flex-col justify-start items-start">
        <p className="text-sm text-slate-400 mb-3">Collection name : </p>
        <h1 className="text-5xl text-slate-700 font-bold">
          {collection?.name || "N/A"}
        </h1>
      </span>
      {collections?.length > 0 ? (
        <div className="w-full mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {collections.map((item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 flex flex-col items-center"
            >
              <img
                src={
                  item?.movie?.poster !== "N/A"
                    ? item?.movie?.poster
                    : defaultMoviePlaceHolder
                }
                alt={item?.movie?.Title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="font-bold text-lg text-center">
                {item?.movie?.title}
              </h2>
              <p className="text-gray-600">{item?.movie?.year}</p>
              <p className="text-gray-600">{item?.movie?.type}</p>
              <button
                className="bg-rose-400 hover:bg-rose-500 text-white font-normal py-2 px-4 rounded-xl cursor-pointer text-sm mt-3"
                onClick={() => handleConfirmDeleteItem(item?._id)}
              >
                Remove <i className="fa-regular fa-trash-can ml-2"></i>
              </button>
            </div>
          ))}
        </div>
      ) : showNoContentMessage ? (
        <div className="w-full flex flex-col justify-center items-center mt-24">
          <span className="rounded-full h-64 w-64 bg-slate-50 flex flex-col justify-center items-center text-slate-300">
            <i className="fa-solid fa-circle-info text-8xl text-slate-200"></i>
            <h1 className="text-slate-300 mt-5 text-xs">
              No movies in this collection
            </h1>
          </span>
        </div>
      ) : null}

      <div className="flex justify-center items-center w-full overflow-x-auto mt-8">
        <Paginator
          first={(currentPage - 1) * pageSize}
          rows={pageSize}
          totalRecords={total || 0}
          onPageChange={onPageChange}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        />
      </div>

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
        popUpContent={
          "Are you sure want to delete the movie from this collection?"
        }
        handleConfirm={() => handleDelete()}
      />

      <div className="h-32"></div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
