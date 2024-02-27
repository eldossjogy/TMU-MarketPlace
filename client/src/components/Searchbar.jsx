import React, {useState, useEffect} from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import toast, { Toaster } from 'react-hot-toast';

export default function Searchbar() {
    const [searchInput, setSearchInput] = useState("");

    const countries = [

        { name: "Belgium", continent: "Europe" },
        { name: "India", continent: "Asia" },
        { name: "Bolivia", continent: "South America" },
        { name: "Ghana", continent: "Africa" },
        { name: "Japan", continent: "Asia" },
        { name: "Canada", continent: "North America" },
        { name: "New Zealand", continent: "Australasia" },
        { name: "Italy", continent: "Europe" },
        { name: "South Africa", continent: "Africa" },
        { name: "China", continent: "Asia" },
        { name: "Paraguay", continent: "South America" },
        { name: "Usa", continent: "North America" },
        { name: "France", continent: "Europe" },
        { name: "Botswana", continent: "Africa" },
        { name: "Spain", continent: "Europe" },
        { name: "Senegal", continent: "Africa" },
        { name: "Brazil", continent: "South America" },
        { name: "Denmark", continent: "Europe" },
        { name: "Mexico", continent: "South America" },
        { name: "Australia", continent: "Australasia" },
        { name: "Tanzania", continent: "Africa" },
        { name: "Bangladesh", continent: "Asia" },
        { name: "Portugal", continent: "Europe" },
        { name: "Pakistan", continent: "Asia" }
      
    ];

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const search = () => {
        toast(`Searching for ${searchInput}`)
    }

    useEffect(() => {
    
      return () => {
        toast(`Searching for ${searchInput}`)
      }
    }, [])
    

    return (
        <div className='flex z-10 space-x-2 h-[4vh] rounded-xl bg-white'>
            <input
                className="rounded-xl h-[4vh] w-[30vw] px-[2vw] text-left focus:outline-none" placeholder="Search here"
                onChange={handleChange}
                value={searchInput}
                
            >
            </input>
            <button className='flex justify-center items-center w-[4vh] h-[3vh] pr-[1vh] my-auto' onClick={() => {search()}}>
                <MagnifyingGlassIcon/>
            </button>
        </div>
    )
}


