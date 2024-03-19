import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import SearchContext from '../authAndContext/searchProvider';
import React, {useContext, useEffect, useState} from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Searchbar(searchLocation) {
    const {searchInput, setSearchInput, updateFilters } = useContext(SearchContext);
    const [onSearchPage, setOnSearchPage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const search = (e, options = {}) => {
        if(e) e.preventDefault()
        if(onSearchPage === null) return;
        if(onSearchPage === false){
            navigate(`/search${searchInput && searchInput !== '' ? `?q=${searchInput}` : (options.query && options.query !== '' ? `?q=${options.query}` : '')}`);
            // console.log(searchInput);
            setOnSearchPage(true);
            return;
        }

        toast(`Searching for ${searchInput === '' ? (options.query ? options.query : 'all posts') : searchInput}`);
        updateFilters(options);
    }

    useEffect(() => {
        if(onSearchPage === true) {
            const searchParams = new URLSearchParams(location.search);
            let options = {};
            if(searchParams.get('q')) options.query = (searchParams.get('q'));
            if(!isNaN(parseInt(searchParams.get('min')))) options.min = (parseInt(searchParams.get('min')));
            if(!isNaN(parseInt(searchParams.get('max')))) options.max = (parseInt(searchParams.get('max')));
            if(!isNaN(parseInt(searchParams.get('status')))) options.status = (parseInt(searchParams.get('status')));
            if(!isNaN(parseInt(searchParams.get('maxDaysOld')))) options.maxDays = (parseInt(searchParams.get('maxDaysOld')))
            if(!isNaN(parseInt(searchParams.get('page')))) options.page = (parseInt(searchParams.get('page')))
            if(!isNaN(parseInt(searchParams.get('category')))) options.category = (parseInt(searchParams.get('category')));

            search(null, options);
        }
    }, [onSearchPage])

    useEffect(() => {
        let path = window.location.pathname;
        if(path.startsWith('/search')){ 
            setOnSearchPage(true);
        }  
        else setOnSearchPage(false);
    }, [])

    return (
        <form id='search-bar' className='flex w-full h-10 md:h-8 group divide-x-2 divide-neutral-400' onSubmit={search}>
            <input
                className="md:hidden rounded-l-xl h-full w-full px-4 text-left focus:outline-none text-ellipsis border-none focus:ring-0" 
                placeholder={`Search here`}
                onChange={handleChange}
                value={searchInput}
            ></input>
            <input
                className="hidden md:block rounded-l-xl h-full w-full px-4 text-left focus:outline-none text-ellipsis border-none focus:ring-0" 
                placeholder={`Search ${searchLocation?.location ?? "here"}`}
                onChange={handleChange}
                value={searchInput}
            ></input>
            <button className='bg-white flex justify-center items-center w-12 md:w-8 h-full p-1 my-auto rounded-r-xl hover:fill-yellow-500' >
                <MagnifyingGlassIcon className='w-6 h-6 fill-inherit'/>
            </button>
        </form>
    )
}


