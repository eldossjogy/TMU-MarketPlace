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
        if(e) e.preventDefault();
        if(onSearchPage === null) return;
        if(onSearchPage === false){
            navigate(`/search${searchInput && searchInput !== '' ? `?q=${searchInput}` : (options.query && options.query !== '' ? `?q=${options.query}` : '')}`);
            // console.log(searchInput);
            setOnSearchPage(true);
            return;
        }

        let searchMessage = `Searching for ${searchInput === '' ? (options.query ? options.query : 'all ads') : searchInput}`;
        toast.promise(updateFilters(options), {loading: searchMessage + '...', success: searchMessage, error: 'Search failed'});
    }

    useEffect(() => {
        if(onSearchPage === true) {
            const searchParams = new URLSearchParams(location.search);
            let options = {};
            if(searchParams.get('q')) options.query = (searchParams.get('q'));
            options.min = !isNaN(parseInt(searchParams.get('min'))) ? parseInt(searchParams.get('min')) : '';
            options.max = !isNaN(parseInt(searchParams.get('max'))) ? parseInt(searchParams.get('max')) : '';
            options.status = !isNaN(parseInt(searchParams.get('status'))) ? parseInt(searchParams.get('status')) : 1;
            options.maxDays = !isNaN(parseInt(searchParams.get('maxDaysOld'))) ? parseInt(searchParams.get('maxDaysOld')) : 1825;
            // if(!isNaN(parseInt(searchParams.get('page')))) options.page = (parseInt(searchParams.get('page')));
            options.category = !isNaN(parseInt(searchParams.get('category'))) ? parseInt(searchParams.get('category')) : 6;

            search(null, options);
        }
    }, [onSearchPage])

    useEffect(() => {
        let path = window.location.pathname;
        if(path.startsWith('/search')){ 
            setOnSearchPage(true);
        }  
        else{
            setOnSearchPage(false);
            setSearchInput('');
        }
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
            <button className='bg-white flex justify-center items-center w-12 md:w-8 h-full p-1 my-auto rounded-r-xl hover:fill-yellow-500' aria-label='Search'>
                <MagnifyingGlassIcon className='w-6 h-6 fill-inherit'/>
            </button>
        </form>
    )
}


