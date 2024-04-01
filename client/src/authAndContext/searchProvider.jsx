import React, { useState, useEffect, useContext, createContext } from 'react';
import LocationContext from '../authAndContext/locationProvider';
import supabase from "./supabaseConfig";
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthContext from './contextApi';
import { useNavigate } from 'react-router-dom';

const SearchContext = createContext();

export const SearchProvider = ({ children }) =>  {
    const {localSession, user} = useContext(AuthContext);
    const {location, range} = useContext(LocationContext);
    const [grid, setGrid] = useState(false);
    const [sort, setSort] = useState(-1);
    const [historySortState, setHistorySortState] = useState(-1);
    const [savedListingsSortState, setSavedListingsSortState] = useState(-1);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxDays, setMaxDays] = useState(1825);
    const [categoryFilter, setCategoryFilter] = useState(6);
    const [page, setPage] = useState(0);

	const [searchResults, setSearchResults] = useState([]);
    const [userHistory, setUserHistory] = useState([]);
    const [userSavedListings, setUserSavedListings] = useState([]);
    const [userSavedIDs, setUserSavedIDs] = useState({});

	const navigate = useNavigate();

    useEffect(() => {
        if(user) getUserSavedIDs();
        else{
            setUserSavedIDs({});
        }
    }, [user])

    async function searchForAds(options = {}) {
		try {

            /*
                Options
                    - Query
                    - Min and Max Price
                    - Category 
                    - Status
                    - Max Days Old
                    - Page Number
                    - Location (lat lng) and Range
            */

            let searchURL = `${process.env.REACT_APP_BACKEND_API_URL}`;
            let searchQuery = `/search?q=${encodeURI(options.query !== null ? options.query : searchInput)}`

            if(options.min !== null) searchQuery += `&min=${options.min}`;
            else if(minPrice !== '') searchQuery += `&min=${minPrice}`;

            if(options.max !== null) searchQuery += `&max=${options.max}`;
            else if(maxPrice !== '') searchQuery += `&max=${maxPrice}`;

            if(options.category && options.category !== null) searchQuery += `&category=${options.category}`
            else searchQuery += `&category=${categoryFilter}`

            if(options.status !== null) searchQuery += `&status=${options.status}`
            else searchQuery += `&status=${statusFilter}`

            if(options.maxDays && options.maxDays !== null) searchQuery += `&maxDays=${options.maxDays}`
            else if(maxDays) searchQuery += `&maxDays=${maxDays}`

            if(options.page && options.page !== null) searchQuery += `&page=${options.page}`
            else if(page && page !== 0) searchQuery += `&page=${page}`

            if(options.lat && options.lng && options.range) searchQuery += `&lat=${options.lat}&lng=${options.lng}&range=${options.range}`
            else if(location.lat && location.lng && range) searchQuery += `&lat=${location.lat}&lng=${location.lng}&range=${range}`

            window.history.replaceState(null, "TMMU Marketplace", searchQuery)

			const { data, error } = await axios.get(searchURL + searchQuery)

			if (error) {
				// toast.error(error.message);
				console.log(error);
                return Promise.reject(new Error(error));
			}
            await getUserSavedIDs();

			return sortResults(-1, data?.data ?? []);
		} catch (error) {
			// toast.error(error.message);
			console.log(error);
            return Promise.reject(new Error(error));
		}
	}

    async function updateFilters(options = {}) {
        try {
            let parsedOptions = {query: null, min: null, max: null, status: null, maxDays: null, category: null};

            if(Object.hasOwn(options, 'query')){
                parsedOptions.query = options.query;
                setSearchInput(options.query);
            }

            if(Object.hasOwn(options, 'min')){
                if(!isNaN(parseInt(options.min))){
                    parsedOptions.min = parseInt(options.min);
                    setMinPrice(parsedOptions.min);
                }
                else if(options.min === ''){
                    parsedOptions.min = '';
                    setMinPrice('');
                }
            }

            if(Object.hasOwn(options, 'max')){
                if(!isNaN(parseInt(options.max))){
                    parsedOptions.max = parseInt(options.max);
                    setMaxPrice(parsedOptions.max);
                }
                else if(options.max === ''){
                    parsedOptions.max = '';
                    setMaxPrice('');
                }
            }

            if(Object.hasOwn(options, 'category') && !isNaN(parseInt(options.category))){
                parsedOptions.category = parseInt(options.category);
                setCategoryFilter(parsedOptions.category);
            }

            if(Object.hasOwn(options, 'status') && !isNaN(parseInt(options.status))){
                parsedOptions.status = parseInt(options.status);
                setStatusFilter(parsedOptions.status);
            }

            if(Object.hasOwn(options, 'maxDays') && !isNaN(parseInt(options.maxDays))){
                parsedOptions.maxDays = parseInt(options.maxDays);
                setMaxDays(parsedOptions.maxDays);
            }

            if((Object.hasOwn(options, 'lat') && !isNaN(parseFloat(options.lat))) && (Object.hasOwn(options, 'lng') && !isNaN(parseFloat(options.lng)))){
                parsedOptions.lat = parseFloat(options.lat);
                parsedOptions.lng = parseFloat(options.lng);
                // setSearchLocation({lat: options.lat, lng: options.lng});
            }

            if(Object.hasOwn(options, 'range') && !isNaN(parseInt(options.range))){
                parsedOptions.range = parseInt(options.range);
            }

            if(Object.hasOwn(options, 'page') && !isNaN(parseInt(options.page))){
                parsedOptions.page = Math.max(parseInt(options.page), 0);
                setStatusFilter(parsedOptions.page);
            }
            
            return searchForAds(parsedOptions);
        } catch (error) {
            return Promise.reject(new Error(error));
        }
    }

    function sortResults(sortType = -1, data = searchResults) {
        try {
            let tempResults = [...data];
            switch (sortType) {
                case 0: // Sort by name Down
                    tempResults.sort((a,b) => {return a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase() ? 1 : -1});
                    break;
                case 1: // Sort by name Up
                    tempResults.sort((a,b) => {return a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase() ? 1 : -1});
                    break;
                case 2: // Sort by price Down
                    tempResults.sort((a,b) => {return a.price - b.price});
                    break;
                case 3: // Sort by price Up
                    tempResults.sort((a,b) => {return b.price - a.price});
                    break;
                case 4: // Sort by date Down 
                    tempResults.sort((a,b) => {return (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime()});
                    break;
                case 5: // Sort by date Up
                    tempResults.sort((a,b) => {return (new Date(b.created_at)).getTime() - (new Date(a.created_at)).getTime()});
                    break;
                case 6: // Sort by distance Down
                    tempResults.sort((a,b) => {return a.distance >= b.distance ? -1 : 1});
                    break;
                case 7: // Sort by distance Up
                    tempResults.sort((a,b) => {return a.distance < b.distance ? -1 : 1});
                    break;
                default: // Sort by ID Down
                    tempResults.sort((a,b) => {return a.id - b.id});
                    break;
            }
            setSort(sortType);
            setSearchResults(tempResults);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error(error));
        }
    }

    function sortHistory(sortType = -1, data = userHistory) {
        let tempResults = sortByDate(sortType, data);
        setHistorySortState(sortType);
        setUserHistory(tempResults);
        return tempResults;
    }

    function sortSaved(sortType = -1, data = userSavedListings) {
        let tempResults = sortByDate(sortType, data);
        setSavedListingsSortState(sortType);
        setUserSavedListings(tempResults);
        return tempResults;
    }

    function sortByDate(sortType = -1, data = []) {
        let tempResults = [...data];
        switch (sortType) {
            case 0: // Sort by date Down (Recent to later)
                tempResults.sort((a,b) => {return (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime()});
                break;
            case 1: // Sort by date Up
                tempResults.sort((a,b) => {return (new Date(b.created_at)).getTime() - (new Date(a.created_at)).getTime()});
                break;
            default: // Sort at SQL level
                break;
        }

        return tempResults;
    }

    async function addToHistory(ad_id) {
		try {
			if (localSession !== null && user !== null) {
				const {error} = await axios.post(
					`${process.env.REACT_APP_BACKEND_API_URL}/history`,
					{
						ad_id: ad_id
					},
					{
						headers: {
							Authorization: "Bearer " + localSession.access_token,
						},
					}
				);
                if(error) return Promise.reject(error);
                return Promise.resolve();
			}
		} catch (error) {
			toast.error(error.message);
            return Promise.reject(error.message);
		}
	}

	async function getUserHistory(limit) {
        let checkUser = user
		try {
            if(user === null) checkUser = await supabase.auth.getUser().then((data) => {return data?.user});

			if (checkUser !== null) {
				const { data, error } = await axios.get(
					`${process.env.REACT_APP_BACKEND_API_URL}/history${!isNaN(parseInt(limit)) ? `?limit=` + parseInt(limit) : ''}`,
					{
						headers: {
							Authorization: "Bearer " + localSession.access_token,
						},
					}
				);
				if(error){
					toast.error("Error fetching your history.");
					console.log(error);
					setUserHistory([]);
				}
				else if(data){
                    return getUserSavedIDs().then(sortHistory(historySortState, data?.data ?? []));
				}

                return [];
			}
            else{
                return [];
            }
		} catch (error) {
			toast.error(error.message);
            return [];
		}
	}

    async function addToSaved(ad_id, add) {
		try {
			if (localSession && user) {
				const {data, error} = await axios.post(
					`${process.env.REACT_APP_BACKEND_API_URL}/saved`,
					{
						ad_id: ad_id
					},
					{
						headers: {
							Authorization: "Bearer " + localSession.access_token,
						},
					}
				);

                if(error) return Promise.reject(error);
                
                let tempSavedIDs = {...userSavedIDs};
                tempSavedIDs[ad_id] = data.data;
                setUserSavedIDs(tempSavedIDs);

                return Promise.resolve(tempSavedIDs);
			}
            else{
                navigate("/login");
                return Promise.reject('Not logged in');
            }
		} catch (error) {
			toast.error(error.message);
            return Promise.reject(error.message);
		}
	}

    async function deleteFromSaved(ad_id) {
		try {
			if (localSession !== null && user !== null) {
				const {error} = await axios.put(
					`${process.env.REACT_APP_BACKEND_API_URL}/saved`,
					{
						ad_id: ad_id
					},
					{
						headers: {
							Authorization: "Bearer " + localSession.access_token,
						},
					}
				);

                if(error) return Promise.reject(error);
                let tempSavedIDs = {...userSavedIDs};
                delete tempSavedIDs[ad_id];
                setUserSavedIDs(tempSavedIDs);

                return Promise.resolve(tempSavedIDs);
			}
            else{
                navigate("/login");
                return Promise.reject('Not logged in')
            }
		} catch (error) {
			toast.error('deleteFromSaved ' + error.message);
            return Promise.reject(error.message);
		}
	}

	async function getUserSavedListings(limit) {
        let checkUser = user ? user : await supabase.auth.getUser().then((data) => {return data?.user});
		try {
			if (checkUser) {
				const { data, error } = await axios.get(
					`${process.env.REACT_APP_BACKEND_API_URL}/saved${!isNaN(parseInt(limit)) ? `?limit=` + parseInt(limit) : ''}`,
					{
						headers: {
							Authorization: "Bearer " + localSession.access_token,
						},
					}
				);
				if(error){
					toast.error("Error fetching your saved listings.");
					console.log(error);
					setUserSavedListings([]);
				}

				return getUserSavedIDs().then(sortSaved(savedListingsSortState, data?.data ?? []));
			}
            else{
                console.log('cck');
            };
		} catch (error) {
			toast.error('getUserSavedListings ' + error.message);
            return [];
		}
	}

    async function getUserSavedIDs() {
        let checkUser = user;
		try {
            if(!user) checkUser = await supabase.auth.getUser().then((data) => {return data?.user});

			if (checkUser) {
                console.log(checkUser);
				const { data, error } = await axios.get(
					`${process.env.REACT_APP_BACKEND_API_URL}/saved/ids`,
					{
						headers: {
							Authorization: "Bearer " + localSession.access_token,
						},
					}
				);

				if(error) throw new Error(error.message);
                setUserSavedIDs(data?.data ?? {})
                return data?.data ?? {};
			}
            else return {};
		} catch (error) {
			toast.error('getUserSavedIDs ' + error.message);
            return {};
		}
	}

    return (
        <SearchContext.Provider value={{
            searchResults,
            updateFilters,
            searchInput, 
            setSearchInput,
            statusFilter,
            minPrice, 
            maxPrice, 
            maxDays,
            categoryFilter,
            grid,
            setGrid,
            sort, 
            sortResults,
		    addToHistory,
            getUserHistory,
            userHistory,
            sortHistory,
            historySortState,
            addToSaved,
            getUserSavedListings,
            userSavedListings,
            sortSaved,
            savedListingsSortState,
            deleteFromSaved,
            getUserSavedIDs,
            userSavedIDs
        }} >
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext
