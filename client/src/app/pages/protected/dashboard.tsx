import React, {useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../common/providers/user.provider";
import Button from "../../components/button.component";
import LoadingSpinner from "../../components/loading-spinner.component";
import { useScrollToTop } from "../../common/hooks/use-scroll-to-top";
import useToken from "../../hooks/useToken";
import {  getAllCollections} from "../../services/collection-api.service";
import { Paginator } from "primereact/paginator";
import FormPopupComponent from "../../components/form-popup.component";
import { getAllMovies } from "../../services/movies.service";
import defaultMoviePlaceHolder from "../../common/assets/images/default-movie.png";
import SelectField from "../../components/select-field.component";
import { addMovieToCollection } from "../../services/user-collection-api.service";

export default function Dashboard() {
  useScrollToTop();
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
    if (accessToken && (user || storedUser)) {
      handleGetAllMovies(accessToken);
    }
    const timeoutId = setTimeout(
      () => {
        setShowNoContentMessage(true);
      },
      collections?.length === 0 ? 0 : 100
    );
    return () => clearTimeout(timeoutId);
  }, [currentPage, pageSize]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = JSON.parse(localStorage.getItem("user") || "");
    if (accessToken && (user || storedUser)) {
      handleGetAllCollectionList(accessToken);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, pageSize]);

  // Get all //

  const handleGetAllMovies = async (token: any) => {
    try {
      setIsLoading(true);
      const response = await getAllMovies(
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
      handleGetAllMovies(accessToken);
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
      const response = await getAllMovies(
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
    { label: "Title", field: "title" },
    { label: "Year", field: "year" },
    { label: "Type", field: "type" },
  ];

  // Create
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    movieDetails: {
      title: "",
      year: "",
      imdbID: "",
      type: "",
      poster: "",
    },
  });

  // Clearing the form 
  const handleAddMovieToCollection = async (item: any) => {
    setFormData({
      movieDetails: {
        title: item?.Title || "",
        year: item?.Year || "",
        imdbID: item?.imdbID || "",
        type: item?.Type || "",
        poster: item?.Poster || "",
      },
    });
    setIsAddFormOpen(true);
  };

  const [selectedCollection, setSelectedCollection] = useState("");

  // Getting the collection list
  const [collectionList, setCollectionList] = useState<any[]>([]);
  const handleGetAllCollectionList = async (token: any) => {
    try {
      setIsLoading(true);
      const response = await getAllCollections(
        token,
        currentPage,
        1000,
        searchQuery
      );
      if (response.success && response?.data?.data?.items) {
        setCollectionList(response.data.data.items);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during form action:", error);
      setIsLoading(false);
    }
  };

  const correctOptionsType = (collectionList || []).map((item: any) => ({
    value: item?._id,
    label: item?.name,
  }));
  const handleSelectCorrectOptionChange = (value: string) => {
    setSelectedCollection(value);
  };

  // Handle create form action
  const handleFormAction = async (e: any) => {
    e.preventDefault();
    const { movieDetails } = formData;

    // Validate movieDetails
    if (
      !movieDetails.title ||
      !movieDetails.year ||
      !movieDetails.imdbID ||
      !movieDetails.type ||
      !movieDetails.poster
    ) {
      toast.error("Please fill in all movie details");
      return;
    } else {
      try {
        setIsLoading(true);

        // Create FormData object to handle file upload
        const formData = new FormData();

        // Append movieDetails fields
        formData.append("movieDetails[title]", movieDetails.title);
        formData.append("movieDetails[year]", movieDetails.year);
        formData.append("movieDetails[imdbID]", movieDetails.imdbID);
        formData.append("movieDetails[type]", movieDetails.type);
        formData.append("movieDetails[poster]", movieDetails.poster);

        // Append selected collection
        if (selectedCollection) {
          formData.append("collectionId", selectedCollection);
        } else {
          toast.error("Please select a collection");
          setIsLoading(false);
          return;
        }

        // Calling to the API service
        const response = await addMovieToCollection(
          token,
          formData,
          selectedCollection
        );

        // Handling the response
        if (response.success) {
          setFormData({
            movieDetails: {
              title: "",
              year: "",
              imdbID: "",
              type: "",
              poster: "",
            },
          });
          setIsAddFormOpen(false);
          setSelectedCollection("");
          handleGetAllMovies(token);
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

  // View single

  const [isItemViewOpen, setIsItemViewOpen] = useState<boolean>(false);

  const handleViewItem = async (item: any) => {
    setIsItemViewOpen(true);
  };

  return (
    <React.Fragment>
      <h1 className="text-5xl text-slate-700 font-bold">Movies</h1>
      <div className="w-full px-3 bg-slate-50 rounded-lg mt-10">
        <div
          className={`w-full h-14 mb-4 py-4 px-5 border-none rounded-lg font-normal flex flex-row items-center justify-center`}
        >
          <i className={`fa-solid fa-magnifying-glass text-slate-400`}></i>
          <input
            className={`w-full ml-5 border-none outline-none bg-slate-50 text-slate-500`}
            type={"text"}
            name={"search_query"}
            placeholder={"Search movie"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            onKeyUp={(e) => handleSearchKeyUp(e)}
          />
        </div>
      </div>

      {collections?.length > 0 ? (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {collections.map((item: any) => (
            <div
              key={item?.imdbID}
              className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 flex flex-col items-center"
            >
              <img
                src={
                  item?.Poster !== "N/A"
                    ? item?.Poster
                    : defaultMoviePlaceHolder
                }
                alt={item?.Title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="font-bold text-lg text-center">{item?.Title}</h2>
              <p className="text-gray-600">{item?.Year}</p>
              <p className="text-gray-600">{item?.Type}</p>
              <button
                className="bg-secondary-dark hover:bg-orange-400 text-white font-normal py-2 px-4 rounded-xl cursor-pointer text-sm mt-3"
                onClick={() => handleAddMovieToCollection(item)}
              >
                Add <i className="fa-solid fa-plus ml-2"></i>
              </button>
            </div>
          ))}
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
        popUpTitle={"Select collection"}
      >
        <form className="w-full bg-slate-100 p-5 rounded-xl my-10">
          <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-3">
              <div className="w-full px-3 mb-10">
                <SelectField
                  icon="fa-solid fa-check"
                  options={correctOptionsType}
                  value={selectedCollection}
                  onChange={handleSelectCorrectOptionChange}
                  disabled={false}
                  label="Select the collection"
                  placeholder={"Select collection"}
                />
              </div>
            </div>
            <div className="w-full px-3 mb-6">
              <Button name={"Add"} handleAction={handleFormAction} />
            </div>
          </div>
        </form>
      </FormPopupComponent>

      <div className="h-32"></div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
