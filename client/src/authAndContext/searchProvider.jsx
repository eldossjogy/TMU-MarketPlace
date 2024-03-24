import React, { useState, useEffect, useContext, createContext } from 'react';
import LocationContext from '../authAndContext/locationProvider';
import supabase from "./supabaseConfig";
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthContext from './contextApi';

const SearchContext = createContext();

export const SearchProvider = ({ children }) =>  {
    const {localSession} = useContext(AuthContext);
    const {location, range} = useContext(LocationContext);
    const [grid, setGrid] = useState(false);
    const [sort, setSort] = useState(0);
    const [historySort, setHistorySort] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxDays, setMaxDays] = useState(1825);
    const [categoryFilter, setCategoryFilter] = useState(6);
    const [page, setPage] = useState(0);

	const [searchResults, setSearchResults] = useState([]);
    const [userHistory, setUserHistory] = useState([]);

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

			sortResults(-1, data?.data ?? []);

			if (error) {
				toast.error(error.message);
				console.log(error);
			}
		} catch (error) {
			toast.error(error.message);
			console.log(error);
		}
	}

    async function updateFilters(options = {}) {
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
        
        searchForAds(parsedOptions);
    }

    function sortResults(sortType = -1, data = searchResults) {
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
    }

    function sortHistory(sortType = -1, data = userHistory) {
        let tempResults = [...data];
        switch (sortType) {
            case 0: // Sort by date Down
                tempResults.sort((a,b) => {return (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime()});
                break;
            case 1: // Sort by date Up
                tempResults.sort((a,b) => {return (new Date(b.created_at)).getTime() - (new Date(a.created_at)).getTime()});
                break;
            default: // Sort at SQL level
                break;
        }
        setHistorySort(sortType);
        setUserHistory(tempResults);
    }

    async function addToHistory(ad_id) {
		const checkUser = await supabase.auth.getUser();
		try {
			if (checkUser.data.user !== null && localSession !== null) {
				const response = await axios.post(
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
			}
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function getUserHistory(limit) {
		const checkUser = await supabase.auth.getUser();
		try {
			if (checkUser.data.user !== null && localSession !== null) {
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
                    sortHistory(historySort, data?.data ?? []);
				}
			}
		} catch (error) {
			toast.error(error.message);
		}
	}

    async function addToSaved(ad_id) {
		const checkUser = await supabase.auth.getUser();
		try {
			if (checkUser.data.user !== null && localSession !== null) {
				const response = await axios.post(
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
			}
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function getUserSavedListings(limit) {
		const checkUser = await supabase.auth.getUser();
		try {
			if (checkUser.data.user !== null && localSession !== null) {
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
					setUserHistory(data.data);
				}
			}
		} catch (error) {
			toast.error(error.message);
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
            historySort,
        }} >
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext
