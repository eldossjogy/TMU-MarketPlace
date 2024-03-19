import React, { useState, useEffect, useContext, createContext } from 'react';
import LocationContext from '../authAndContext/locationProvider';
import toast from 'react-hot-toast';
import axios from 'axios';

const SearchContext = createContext();

export const SearchProvider = ({ children }) =>  {
    const {location} = useContext(LocationContext);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxDays, setMaxDays] = useState(null);
    const [page, setPage] = useState(0);
    const [searchLocation, setSearchLocation] = useState({lat: 43.65775180503111, lng:-79.3786619239608})

	const [searchResults, setSearchResults] = useState([]);

    async function searchForAds(options = {}) {
		try {
            let searchURL = `${process.env.REACT_APP_BACKEND_API_URL}/search?q=${encodeURI(options.query !== null ? options.query : searchInput)}`;

            if(options.min !== null) searchURL += `&min=${options.min}`;
            else if(minPrice !== '') searchURL += `&min=${minPrice}`;

            if(options.max !== null) searchURL += `&max=${options.max}`;
            else if(maxPrice !== '') searchURL += `&max=${maxPrice}`;

            if(options.status !== null) searchURL += `&status=${options.status}`
            else searchURL += `&status=${statusFilter}`

            if(options.maxDays && options.maxDays !== null) searchURL += `&maxDays=${options.maxDays}`
            else if(maxDays) searchURL += `&maxDays=${maxDays}`

            if(options.page && options.page !== null) searchURL += `&page=${options.page}`
            else if(page && page !== 0) searchURL += `&page=${page}`

            if(options.lat && options.lng) searchURL += `&lat=${options.lat}&lng=${options.lng}`
            else if(searchLocation.lat && searchLocation.lng) searchURL += `&lat=${searchLocation.lat}&lng=${searchLocation.lng}`

            if(options.range) searchURL += `&range=${options.range}`


			const { data, error } = await axios.get(searchURL)

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

    // async function filterResults(){
    //     let newFilteredResults = searchResults.reduce(function(stack, result) {
    //         if (parseInt(minPrice) && result.price < parseInt(minPrice)) {
    //             return stack;
    //         }
    //         if (parseInt(maxPrice) && result.price > parseInt(maxPrice)) {
    //             return stack;
    //         }
    //         if (parseInt(statusFilter) && (statusFilter === 5 ? result.status_id === 4 : result.status_id !== parseInt(statusFilter))){
    //             return stack;
    //         }
    //         if (maxDays && result.created_at){
    //             const rawDate = new Date(result.created_at);
    //             const rawAge = Date.now() - rawDate.getTime();
    //             const days = Math.round(rawAge / (1000 * 3600 * 24));
    //             if(days > maxDays) return stack;
    //         }

    //         stack ? stack.push(result) : [result];
    //         return stack;
    //     }, []);
    //     setFilteredResults(newFilteredResults ?? searchResults);
    // }

    async function updateFilters(options = {}) {
        let parsedOptions = {query: null, min: null, max: null, status: null, maxDays: null};


        if(Object.hasOwn(options, 'query')){
            parsedOptions.query = options.query;
            setSearchInput(options.query);
        }

        if(Object.hasOwn(options, 'min') && !isNaN(parseInt(options.min))){
            parsedOptions.min = parseInt(options.min);
            setMinPrice(parsedOptions.min);
        }

        if(Object.hasOwn(options, 'max') && !isNaN(parseInt(options.max))){
            parsedOptions.max = parseInt(options.max);
            setMaxPrice(parsedOptions.max);
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
        }} >
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext
