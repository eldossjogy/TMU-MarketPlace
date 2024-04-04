import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../authAndContext/contextApi'
import axios from 'axios'
import LoadingScreen from './LoadingScreen'
import ImageCarousel from '../components/ImageCarousel'
import AdminListingForm from './AdminListingForm'
import supabase from '../authAndContext/supabaseConfig'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function AdminAdDashboard() {

    const {loadingState, setLoadingState, localSession, uploadImageToBucket, fetchMyPostings} = useContext(AuthContext)

    const navigate = useNavigate()

    const [localLoading, setLocalLoading] = useState(false)
    
    const [addNewToggle, setaddNewToggle] = useState(false)
    const [filterToggle, setFilterToggle] = useState(false)
    const [deleteModalToggle, setDeleteModalToggle] = useState(false)
    const [secondaryDeleteToggle, setSecondaryDeleteToggle] = useState(false)

    //contains single item selected for deleting
    const [singleDeleteListing, setSingleDeleteListing] = useState([])

    //string to store query value
    const [searchQuery, setSearchQuery] = useState("")

    //arr to store checked items
    const [selectedItems, setSelectedItems] = useState([])

    //to build table data
    const [coloumns, setColoumns] = useState([])
    const [allAdListings, setAllAdListings] = useState([])

    //row action button (ellipsis)
    const [editItemButtons, setEditItemButtons] = useState(Array(allAdListings.length).fill(false));

    const [editModalFlag, setEditModalFlag] = useState(false)
    const [editModalInfo, setEditModalInfo] = useState(null)

    const [previewListingFlag, setPreviewListingFlag] = useState(false)
    const [previewListing, setPreviewListing] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLocalLoading(true);
            try {
                await getAdDatabase();
            } finally {
                setLocalLoading(false);
            }
        }
        fetchData();
    }, []);

    async function getAdDatabase() {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_API_URL}/admin/get-all-listings`,
                {
                    headers: {
                        Authorization:" Bearer " + (localSession.access_token ?? localSession.session.access_token)
                    },
                }
            )
            setAllAdListings(response.data)
            if (response.data.length > 0) {
                setColoumns(() => {
                    return Object.keys(response.data[0]).map(key => ({
                        name: key,
                        active: true
                    }));
                });
            }
            toast.success("Ad Listing Records fetched!")
        }
        catch(error) {
            toast.error(error.response.data.message)
        }
    }

    async function getAdDatabaseQuery(queryObject) {
        try {
            const queryParams = coloumns.map(column => `${column.name}=${queryObject[column.name]}`).join('&');

            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_API_URL}/admin/get-all-listings/query?${queryParams}`,
                {
                    headers: {
                        Authorization:" Bearer " + (localSession.access_token ?? localSession.session.access_token)
                    },
                }
            )
            setAllAdListings(response.data)
        }
        catch(error) {
            toast.error(error.response.data.message)
        }
    }

    function toggleEditItemButton(index) {
        const updatedButtons = [...editItemButtons];
        updatedButtons[index] = !updatedButtons[index];
        setEditItemButtons(updatedButtons);
    }

    function handleCheckboxChange(elem) {
        // Check if the element is already selected
        const index = selectedItems.findIndex(item => item.id === elem.id);
        if (index === -1) {
            // If not selected, add it to the selectedItems array
            setSelectedItems([...selectedItems, elem]);
        } else {
            // If already selected, remove it from the selectedItems array
            const updatedSelectedItems = [...selectedItems];
            updatedSelectedItems.splice(index, 1);
            setSelectedItems(updatedSelectedItems);
        }
    }

    function handleAllCheckBoxButton() {
        if (selectedItems.length === 0 || selectedItems.length < allAdListings.length) setSelectedItems(allAdListings)
        else setSelectedItems([])

    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        
        // Get the day, month, year, hours, minutes, and seconds
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        // Concatenate the formatted date and time
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
    
        // Return the formatted date and time
        return `${formattedDate} ${formattedTime}`;
    }
    
    function isRowSelected(elem) {
        return selectedItems.some(item => item.id === elem.id);
    }

    function handleRowActionClick(action, elem) {
        setEditItemButtons(prev => [false])
        if(action ==="Preview") {
            setPreviewListingFlag(prev => !prev)
            setPreviewListing(elem)
            setEditModalInfo(elem)
        }
        else if(action ==="Edit") {
            setEditModalFlag(prev => !prev)
            setEditModalInfo(elem)
        }
    }

    function handleModalActionClick(action) {
        if(action ==="Preview") {
            setPreviewListingFlag(prev => !prev)
            setPreviewListing(null)
            setEditModalInfo(null)
        }
        else if(action ==="Edit") {
            setEditModalFlag(prev => !prev)
            setEditModalInfo(null)
        }
    }
    
    function parseQueryString(queryString) {
        const queryObject = {};
    
        // If the queryString is empty, return an empty object
        if (!queryString) return {};
    
        // Split the query string by commas
        const queryPairs = queryString.split(', ');
    
        queryPairs.forEach(pair => {

            // Split each pair by '='
            const [key, value] = pair.split('=');

            if(!value) {
                alert("invalid query format")
                return
            }
    
            // Trim any leading or trailing whitespace from the value
            const trimmedValue = value.trim();
    
            // Convert the key to lowercase and trim any leading or trailing whitespace
            const trimmedKey = key.trim().toLowerCase();
    
            // Check if the key is repeated
            if (queryObject.hasOwnProperty(trimmedKey)) {
                alert(`Key"${trimmedKey}" is repeated. Only the first occurrence will be used.`);
                return; // Skip this key-value pair
            }
    
            // Check if the trimmedKey exists in the columns array
            if (coloumns.find(elem => elem.name === trimmedKey)) {
                // Add key-value pair to the queryObject
                queryObject[trimmedKey] = trimmedValue;
            } else {
                // If the key is not in the columns array, ignore it
                alert(`Key"${trimmedKey}" is not a valid column.`);
            }
        });
    
        return queryObject;
    }

    async function searchDatabaseQuery(event) {
        event.preventDefault()
        const queryObject = parseQueryString(searchQuery)
        await getAdDatabaseQuery(queryObject)
    }

    function updateListingsLocally(action, listingInfo, updatedData) {
		if (action ==="Modify") {
			let targetIndex = allAdListings.indexOf(listingInfo)
			setAllAdListings(prev => prev.map((item, i) => {
				if (i !== targetIndex) {
					return item; // Keep the item unchanged if the index doesn't match
				} else {
					return updatedData; // Replace the item at the target index with updatedData
				}
			}));
		}
		else if (action ==="Delete") {
			let targetIndex = allAdListings.indexOf(listingInfo)
			setAllAdListings(prev => prev.filter((item, i) => i !== targetIndex));
		}
		else if (action ==="Add") {
			setAllAdListings(prev => [listingInfo, ...prev])
		}
		else if (action ==="Update") {
			const updatedUserListings = allAdListings.map((elem, index) => {
				if (elem.id === listingInfo.id) {
					return listingInfo
				}
				else return elem
			})
			setAllAdListings(updatedUserListings)
		}
	}

    async function putReqAsAdmin(listingInfo, imageList) {
        const checkUser = await supabase.auth.getUser();
		try {
            if (checkUser.data.user !== null) {
                const listOfImages = await uploadImageToBucket(
                imageList,
               "ad-listings"
                );
                const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_API_URL}/admin/update-listing`,
                { listingInfo: {...listingInfo, image: [...listingInfo.image.map(item => item.file_path), ...listOfImages]}
                },
                {
                    headers: {
                        Authorization:" Bearer " + (localSession.access_token ?? localSession.session.access_token)
                    },
                }
                );
                updateListingsLocally("Update", response.data)
                setEditModalFlag(false)
                toast.success("Listing updated!")
		} else {
			const error = new Error("Unauthorized access!! not a logged in user!!");
			error.status = 403;
			throw error;
		}
		} catch (error) {
			toast.error(error.response.data.message);
		}

		setLoadingState(false);
    }

    async function postReqAsAdmin(listingInfo, imageList) {

        //change this to check for admin prvilege
        const checkUser = await supabase.auth.getUser();
        
		try {
			if (checkUser.data.user !== null) {
				const listOfImages = await uploadImageToBucket(
					imageList,
					"ad-listings"
				);
				const response = await axios.post(
					`${process.env.REACT_APP_BACKEND_API_URL}/admin/create-new-listing`,
					{
						...listingInfo,
						images: listOfImages,
					},
					{
						headers: {
                            Authorization:" Bearer " + (localSession.access_token ?? localSession.session.access_token)
						},
					}
				);

                //reload the get req to fetch new data // or add the new data to current list below:
                updateListingsLocally("Add", response.data)
                setaddNewToggle(false)
                toast.success("New Listing Posted!")
                fetchMyPostings()

			} else {
				const error = new Error("Unauthorised");
				error.status = 403;
				toast.error(error.message);
				throw error;
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}


		setLoadingState(false);
    }

    async function deleteListing(listingArr) {
        
        setLoadingState(true)

        try{
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_API_URL}/admin/delete-listing`,{
                    listingInfoArr: listingArr
                },
                {
                headers: {
                    Authorization:" Bearer " + (localSession.access_token ?? localSession.session.access_token)
                },
                }
            )
            listingArr.forEach((listingInfo, index) => {
                updateListingsLocally('Delete', listingInfo)
            })
            
            setPreviewListingFlag(false)
            setEditModalFlag(false)
            setSelectedItems([])
            setDeleteModalToggle(false)
            setSecondaryDeleteToggle(false)
            setSingleDeleteListing([])
            setEditItemButtons(Array(allAdListings.length).fill(false))

            toast.success(response.data.message)
        }
            catch(error) {
                toast.error(error.response.data.message);
            }
    
            setLoadingState(false)
    }

    function handleFilterChange(e) {
        setColoumns(prev => {
            return prev.map(elem => {
                if (elem.name === e.target.value) {
                    return {...elem, active:!elem.active}
                }
                else return elem
            })
        })
    }

  return (
    <>
            <h5 className='mt-5'>
                    <span className="text-gray-500">Table:</span>
                    <span className="">Ad</span>
            </h5>
              <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <h5 className='mt-5 pl-4'>
                    <span className="text-gray-500">Example: profile=John, category_id=2</span>
                </h5>
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                      <div className="w-full md:w-1/2">
                          <form className="flex items-center" onSubmit={searchDatabaseQuery}>
                              <label htmlFor="simple-search" className="sr-only">Search</label>
                              <div className="relative w-full">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                      </svg>
                                  </div>
                                  <input onChange={(e) => setSearchQuery(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2" placeholder="Search"/>
                              </div>
                          </form>
                      </div>
                      <div className="relative w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            {selectedItems.length > 0 &&
                                <button onClick={() => setDeleteModalToggle(prev => !prev)} type="button" data-modal-target="createProductModal" data-modal-toggle="createProductModal" className="flex items-center justify-center text-white bg-red-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none">
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                    </svg>
                                    Delete
                                </button>
                            }
                            <button onClick={() => getAdDatabase()} type="button" data-modal-target="createProductModal" data-modal-toggle="createProductModal" className="flex items-center justify-center text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none">
                            <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                                Reload
                            </button>
                          <button onClick={() => setaddNewToggle(prev => !prev)} type="button" data-modal-target="createProductModal" data-modal-toggle="createProductModal" className="flex items-center justify-center text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none">
                                <svg className="h-4 w-4 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                </svg>
                              Add Listing
                          </button>
                          <div className="flex items-center space-x-3 w-full md:w-auto">    
                              <button onClick={() => setFilterToggle(prev => !prev)} className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200" type="button">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                  </svg>
                                  Filter
                                  <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" >
                                      <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                  </svg>
                              </button>
                          </div>
                          {filterToggle && 
                                <div className="md:absolute md:top-10 md:right-0 z-10 md:w-56 w-full p-3 bg-white rounded-lg shadow">
                                    <h6 className="mb-3 text-sm font-medium text-gray-900">Category</h6>
                                    <ul className="space-y-2 text-sm">
                                    {coloumns.map((col, index) => (
                                        <>
                                            <li className="flex items-center">
                                                <input onChange={handleFilterChange} checked={col.active} type="checkbox" value={`${col.name}`} className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2" />
                                                <label htmlFor={`${col.name}`} className="ml-2 text-sm font-medium text-gray-900">{col.name}</label>
                                            </li>
                                        </>
                                    ))}
                                        
                                    </ul>
                                </div>
                            }
                      </div>
                  </div>
                  <div className="overflow-x-auto scroll-container">
                      <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              {/*coloumn headers for the table*/}
                              <tr>
                                <th key={998} scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input onClick={handleAllCheckBoxButton} type="checkbox" className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 focus:ring-2" />
                                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                {coloumns.map((col, index) => (
                                    col.active && <th key={index} scope="col" className="px-4 py-3">{col.name}</th>
                                ))}
                                <th key={999} scope="col" className="px-4 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                              </tr>
                          </thead>
                          <tbody>
                              {/*Each <tr> is a row*/}
                              {allAdListings && allAdListings.map((elem, index) => (
                                    <tr key={index} className={`${isRowSelected(elem) ? 'bg-blue-100 border-white' : 'border-b'}`}>
                                        <td className="p-4 w-4">
                                            <div className="flex items-center">
                                                <input checked={isRowSelected(elem)} type="checkbox" onChange={() => handleCheckboxChange(elem)} className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 focus:ring-2" />
                                                <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        {coloumns[0].active && <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{elem.id}</th>}
                                        {coloumns[1].active && <td className="px-4 py-3">{formatDate(elem.created_at)}</td>}
                                        {coloumns[2].active && <td className="px-4 py-3">{elem.category_id}</td>}
                                        {coloumns[3].active && <td className="px-4 py-3">{elem.status_id}</td>}
                                        {coloumns[4].active && <td className="px-4 py-3 truncate max-w-[15rem]">{elem.title}</td>}
                                        {coloumns[5].active && <td className="px-4 py-3">{elem.price}</td>}
                                        {coloumns[6].active && <td className="px-4 py-3 truncate max-w-[20rem]">{elem.description}</td>}
                                        {coloumns[7].active && <td className="px-4 py-3">{formatDate(elem.post_time)}</td>}
                                        {coloumns[8].active && <td className="px-4 py-3">{formatDate(elem.expire_time)}</td>}
                                        {coloumns[9].active && <td className="px-4 py-3">{elem.postal_code}</td>}
                                        {coloumns[10].active && <td className="px-4 py-3 truncate max-w-[15rem]">{elem.location}</td>}
                                        {coloumns[11].active && <td className="px-4 py-3">{elem.user_id}</td>}
                                        {coloumns[12].active && <td className="px-4 py-3">{elem.lng}</td>}
                                        {coloumns[13].active && <td className="px-4 py-3">{elem.lat}</td>}
                                        {coloumns[14].active && <td className="px-4 py-3">{elem.image.length}</td>}
                                        {coloumns[15].active && <td className="px-4 py-3">{elem.category.name}</td>}
                                        {coloumns[16].active && <td className="px-4 py-3">{elem.status.type}</td>}
                                        {coloumns[17].active && <td className="px-4 py-3">{elem.profile.name}</td>}

                                        <td className="px-4 py-3 flex flex-col items-end relative">
                                            <button onClick={() => toggleEditItemButton(index)} className="inline-flex items-center text-sm font-medium hover:bg-gray-100 p-1.5 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none" type="button">
                                                <svg className="w-5 h-5"  fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </button>
                                            {editItemButtons[index] &&
                                                <div className="absolute mt-10 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow">
                                                    <ul className="py-1 text-sm">
                                                        <li>
                                                            <button onClick={() => handleRowActionClick("Edit", elem)} type="button" data-modal-target="updateProductModal" data-modal-toggle="updateProductModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 text-gray-700">
                                                                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button onClick={() => handleRowActionClick("Preview", elem)} type="button" data-modal-target="readProductModal" data-modal-toggle="readProductModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 text-gray-700">
                                                                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                                                                </svg>
                                                                Preview
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button onClick={() => {
                                                                setSingleDeleteListing([elem])
                                                                setSecondaryDeleteToggle(prev => !prev)
                                                            }} type="button" data-modal-target="deleteModal" data-modal-toggle="deleteModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 text-red-500">
                                                                <svg className="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                                                    <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                                <tr className=''><td className='pb-[10%] md:pb-[3%]'></td></tr>
                          </tbody>
                      </table>
                  </div>

                  <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                      <span className="text-sm font-normal text-gray-500">
                          Showing&nbsp;
                          <span className="font-semibold text-gray-900">{allAdListings.length}&nbsp;</span>
                          of&nbsp;
                          <span className="font-semibold text-gray-900">{allAdListings.length}&nbsp;</span>
                      </span>
                      <ul className="inline-flex items-stretch -space-x-px">
                          <li>
                              <a className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                                  <span className="sr-only">Previous</span>
                                  <svg className="w-5 h-5"  fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                              </a>
                          </li>
                          <li>
                              <a className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-black bg-white border border-gray-300 hover:bg-gray-100 hover:text-black">1</a>
                          </li>
                          {/* <li>
                              <a className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
                          </li>
                          <li>
                              <a className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">3</a>
                          </li>
                          <li>
                              <a className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">...</a>
                          </li>
                          <li>
                              <a className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">100</a>
                          </li> */}
                          <li>
                              <a className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                                  <span className="sr-only">Next</span>
                                  <svg className="w-5 h-5"  fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                              </a>
                          </li>
                      </ul>
                  </nav>
              </div>

        {addNewToggle && 
            <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-2xl max-h-full md:max-h-[75%] z-100 overflow-y-auto scrollbar scrollbar-hide">
                    <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Listing</h3>
                            <button onClick={() => setaddNewToggle(prev => !prev)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="updateProductModal">
                                <svg  className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <AdminListingForm typeOfReq='Post' editingForm={false} postReqAsAdmin={postReqAsAdmin} putReqAsAdmin={putReqAsAdmin}/>
                    </div>
                </div>
            </div>
        }

        {editModalFlag &&
            <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-2xl max-h-full md:max-h-[75%] z-100 overflow-y-auto scrollbar scrollbar-hide">
                    <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Update Listing</h3>
                            <button onClick={() => handleModalActionClick("Edit")} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="updateProductModal">
                                <svg  className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <AdminListingForm formDataProp={editModalInfo} typeOfReq='Put' editingForm={true} postReqAsAdmin={postReqAsAdmin} putReqAsAdmin={putReqAsAdmin}/>
                    </div>
                </div>
            </div>
        }

        {previewListingFlag &&
            <div className="overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-xl md:max-w-[40%] max-h-full md:max-h-[70%] overflow-y-auto scrollbar scrollbar-hide">
            
                    <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">

                        <div className="flex justify-between mb-4 rounded-t sm:mb-5">
                            <div className="text-lg text-gray-900 md:text-xl">
                                <h3 className="font-semibold">{previewListing.title}</h3>
                                <p className="font-bold">${previewListing.price}</p>
                            </div>
                            <div>
                                <button onClick={() => handleModalActionClick("Preview")} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex" data-modal-toggle="readProductModal">
                                    <svg  className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                        </div>
                        <dl>
                            <dt className="mb-2 font-semibold leading-none text-gray-900">Status</dt>
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5">{previewListing.status.type}</dd>
                            <dt className="mb-2 font-semibold leading-none text-gray-900">Description</dt>
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5">{previewListing.description}</dd>
                            <dt className="mb-2 font-semibold leading-none text-gray-900">Images</dt>
                            {previewListing.image.length > 0 ?
                            <dd className="mb-2 font-semibold leading-none text-gray-900 w-[40%]">
                                <ImageCarousel images={previewListing.image} hovered={true} />
                            </dd>
                            :
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5">No Images Provided!</dd>
                            }
                            <dt className="mb-2 font-semibold leading-none text-gray-900">Category</dt>
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5">{previewListing.category.name}</dd>
                            <dt className="mb-2 font-semibold leading-none text-gray-900">Location</dt>
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5">{previewListing.location}</dd>
                            <dt className="mb-2 font-semibold leading-none text-gray-900">Created By</dt>
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5">{previewListing.profile.name}</dd>
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5">user_id: {previewListing.user_id}</dd>
                            <dt className="mb-2 font-semibold leading-none text-gray-900">Created at</dt>
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5">{formatDate(previewListing.created_at)}</dd>
                        </dl>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <button onClick={() => {
                                    handleRowActionClick("Edit", previewListing)
                                    setPreviewListingFlag(prev => !prev)
                                }} type="button" className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    <svg  className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                    </svg>
                                    Edit
                                </button>
                                <button onClick={() => navigate(`/ad/${previewListing.id}`)} type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200">User view</button>
                            </div>
                            <button onClick={() => {
                                setSingleDeleteListing([previewListing])
                                setSecondaryDeleteToggle(prev => !prev)
                                }} type="button" className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <svg  className="w-5 h-5 mr-1.5 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        }

        {deleteModalToggle &&
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-md max-h-full">

                    <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
                        <button onClick={() => setDeleteModalToggle(prev => !prev)} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="deleteModal">
                            <svg  className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <svg className="text-gray-400 w-16 h-16 mb-3.5 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="mb-4 text-gray-500">{selectedItems.length > 1 ? `Are you sure you want to delete these ${selectedItems.length} listings?` : `Are you sure you want to delete listing"${selectedItems[0].title}"?`}</p>
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => {deleteListing(selectedItems)}} className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300">Yes, I'm sure</button>
                            <button onClick={() => setDeleteModalToggle(prev => !prev)} type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        }

        {secondaryDeleteToggle &&
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-md max-h-full">

                    <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
                        <button onClick={() => setSecondaryDeleteToggle(prev => !prev)} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="deleteModal">
                            <svg  className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <svg className="text-gray-400 w-16 h-16 mb-3.5 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="mb-4 text-gray-500">{`Are you sure you want to delete listing"${singleDeleteListing[0].title}"?`}</p>
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => {deleteListing(singleDeleteListing)}} className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300">Yes, I'm sure</button>
                            <button onClick={() => setSecondaryDeleteToggle(prev => !prev)} type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        }

        {localLoading &&
			<LoadingScreen message={"Fetching Ad Records from Database..."} />
		}
        {loadingState &&
			<LoadingScreen message={"Performing Action..."} />
		}
    </>
  )
}
