import React, {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast';
import AuthContext from '../authAndContext/contextApi';

export default function Searchbar(location) {
    const [searchInput, setSearchInput] = useState("");
    const [onSearchPage, setOnSearchPage] = useState(null);
    //const {searchForAds} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const search = (e) => {
        if(e) e.preventDefault()
        if(onSearchPage === null) return;

        toast(`Searching for ${searchInput}`);
        //searchForAds(searchInput);

        if(onSearchPage === false){
            navigate('/search/');
            setOnSearchPage(true);
        }
    }

    useEffect(() => {
        let path = window.location.pathname;

        if(path.startsWith('/search')){ 
            setOnSearchPage(true);
            search();
        }  
        else setOnSearchPage(false);
    }, [])

    return (
        <form className='flex w-full h-10 md:h-8 group divide-x-2 divide-neutral-400' onSubmit={search}>
            <input
                className="md:hidden rounded-l-xl h-full w-full px-4 text-left focus:outline-none text-ellipsis border-none focus:ring-0" 
                placeholder={`Search here`}
                onChange={handleChange}
                value={searchInput}
            ></input>
            <input
                className="hidden md:block rounded-l-xl h-full w-full px-4 text-left focus:outline-none text-ellipsis border-none focus:ring-0" 
                placeholder={`Search ${location?.location ?? "here"}`}
                onChange={handleChange}
                value={searchInput}
            ></input>
            <button className='bg-white flex justify-center items-center w-12 md:w-8 h-full p-1 my-auto rounded-r-xl hover:fill-yellow-500' >
                <MagnifyingGlassIcon className='w-6 h-6 fill-inherit'/>
            </button>
        </form>
    )
}


