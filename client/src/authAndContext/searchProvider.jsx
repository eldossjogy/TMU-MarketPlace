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
	const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        setFilteredResults(searchResults);
    },[searchResults])

    async function searchForAds(options = {}) {
		try {
			const { data, error } = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/search?q=${encodeURI(options.query ?? searchInput)}&min=${encodeURI(options.min ?? minPrice)}&max=${encodeURI(options.max ?? maxPrice)}`)

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

    async function filterResults(){
        let newFilteredResults = searchResults.reduce(function(stack, result) {
                if (parseInt(minPrice) && result.price < parseInt(minPrice)) {
                    return stack;
                }
                if (parseInt(maxPrice) && result.price > parseInt(maxPrice)) {
                    return stack;
                }
                if (parseInt(statusFilter) && (statusFilter === 5 ? result.status_id === 4 : result.status_id !== parseInt(statusFilter))){
                    return stack;
                }
                if (maxDays && result.created_at){
                    const rawDate = new Date(result.created_at);
                    const rawAge = Date.now() - rawDate.getTime();
                    const days = Math.round(rawAge / (1000 * 3600 * 24));
                    if(days > maxDays) return stack;
                }

                stack ? stack.push(result) : [result];
                return stack;
            }, []);
        setFilteredResults(newFilteredResults ?? searchResults);
    }

    useEffect(() => {
        filterResults();
    },[statusFilter, minPrice, maxPrice, maxDays])

    return (
        <SearchContext.Provider value={{
            searchResults,
            filteredResults,
            filterResults,
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
