import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SearchContext = createContext();

export const SearchProvider = ({ children }) =>  {
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxDays, setMaxDays] = useState(null);

	const [searchResults, setSearchResults] = useState([]);

    async function searchForAds(options = {}) {
		try {
            let searchURL = `${process.env.REACT_APP_BACKEND_API_URL}/search?q=${encodeURI(options.query != null ? options.query : searchInput)}`;

            if(options.min !== null) searchURL += `&min=${options.min}`;
            else if(minPrice !== '') searchURL += `&min=${minPrice}`;

            if(options.max !== null) searchURL += `&max=${options.max}`;
            else if(maxPrice !== '') searchURL += `&max=${maxPrice}`;

            if(options.status !== null) searchURL += `&status=${options.status}`
            else searchURL += `&status=${statusFilter}`

            if(options.maxDays !== null) searchURL += `&maxDays=${options.maxDays}`
            else if(maxDays) searchURL += `&maxDays=${maxDays}`

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

        console.log(options);

        if(Object.hasOwn(options, 'query')){
            parsedOptions.query = options.query;
            setSearchInput(options.query);
        }

        if(Object.hasOwn(options, 'min')){
            parsedOptions.min = !isNaN(parseInt(options.min)) ? parseInt(options.min) : '';
            setMinPrice(parsedOptions.min);
        }

        if(Object.hasOwn(options, 'max')){
            parsedOptions.max = !isNaN(parseInt(options.max)) ? parseInt(options.max) : '';
            setMaxPrice(parsedOptions.max);
        }

        if(Object.hasOwn(options, 'status')){
            parsedOptions.status = !isNaN(parseInt(options.status)) ? parseInt(options.status) : '';
            setStatusFilter(parsedOptions.status);
        }

        if(Object.hasOwn(options, 'maxDays')){
            parsedOptions.maxDays = !isNaN(parseInt(options.maxDays)) ? parseInt(options.maxDays) : '';
            setMaxDays(parsedOptions.maxDays);
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
            searchForAds,
            searchInput, 
            setSearchInput,
            statusFilter,
            setStatusFilter,
            minPrice, 
            setMinPrice, 
            maxPrice, 
            setMaxPrice,
            maxDays,
            setMaxDays
        }} >
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext
