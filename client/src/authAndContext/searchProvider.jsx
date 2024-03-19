import React, { useState, useEffect, useContext, createContext } from 'react';
import LocationContext from '../authAndContext/locationProvider';
import toast from 'react-hot-toast';
import axios from 'axios';

const SearchContext = createContext();

export const SearchProvider = ({ children }) =>  {
    const {location, range} = useContext(LocationContext);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxDays, setMaxDays] = useState(1825);
    const [categoryFilter, setCategoryFilter] = useState(2);
    const [page, setPage] = useState(0);
    const [searchLocation, setSearchLocation] = useState({lat: 43.65775180503111, lng:-79.3786619239608})

	const [searchResults, setSearchResults] = useState([]);

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
            else if(searchLocation.lat && searchLocation.lng && range) searchQuery += `&lat=${searchLocation.lat}&lng=${searchLocation.lng}&range=${range}`

            window.history.replaceState(null, "TMMU Marketplace", searchQuery)

			const { data, error } = await axios.get(searchURL + searchQuery)

			setSearchResults(data?.data ?? []);

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
            setSearchLocation({lat: options.lat, lng: options.lng});
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

    // useEffect(() => {
    //     searchForAds();
    // },[statusFilter, minPrice, maxPrice, maxDays])

    return (
        <SearchContext.Provider value={{
            searchResults,
            //filteredResults,
            //filterResults,
            updateFilters,
            // searchForAds,
            searchInput, 
            setSearchInput,
            statusFilter,
            // setStatusFilter,
            minPrice, 
            // setMinPrice, 
            maxPrice, 
            // setMaxPrice,
            maxDays,
            // setMaxDays
            categoryFilter
        }} >
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext
