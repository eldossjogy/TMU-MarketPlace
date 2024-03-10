import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast';

export default function Searchbar(location) {
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const search = () => {
        toast(`Searching for ${searchInput}`);
        navigate('/search/');
    }

    return (
        <div className='flex w-full h-10 md:h-8 group divide-x-2 divide-neutral-400'>
            <input
                className="rounded-l-xl h-full w-full px-4 text-left focus:outline-none text-ellipsis" 
                placeholder={`Search ${location?.location ?? "here"}`}
                onChange={handleChange}
                value={searchInput}
            >
            </input>
            <button className='bg-white flex justify-center items-center w-12 md:w-8 h-full p-1 my-auto rounded-r-xl hover:fill-yellow-500' onClick={() => {search()}}>
                <MagnifyingGlassIcon className='w-6 h-6 fill-inherit'/>
            </button>
        </div>
    )
}


