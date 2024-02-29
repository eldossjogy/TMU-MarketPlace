import "../index.css";
import React from 'react'
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";


export default function HomePage() {
    const [filters, setFilters] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        initFilters();
    }, []);

    async function initFilters() {
        setFilters([{ name: 'can' }, { name: 'ban' }, { name: 'ind' }]);
    }

    async function initCategories() {
        setCategories([{ name: 'Automobiles' }, { name: 'Textbooks' }, { name: 'Recently Added' }, { name: 'Electronics' }, { name: 'Supplies' }]);
    }

    return (
        <div className="App">
            <Navbar></Navbar>
            <main className="container m-auto flex flex-wrap md:flex-nowrap mt-4">
                <section id="sidebar" className="w-[20%] h-[80vh] bg-slate-300 rounded-lg shadow-lg">
                    <ul>
                        {filters.map((filter, index) => (
                            <li key={index}>{filters.name}</li>
                        ))}
                    </ul>
                </section>

                <section id="content" className="w-[80%] px-4">
                    <section id="toolbar" className="flex shadow bg-neutral-100 rounded-xl w-full justify-between p-4 items-center">
                        <div id="filters" className="flex space-x-4 text-xl justify-center items-center">
                            <ToolbarButton primary={true} value={"Automobiles"} />
                            <ToolbarButton primary={false} value={"Textbooks"} />
                            <ToolbarButton primary={false} value={"Recently Added"} />
                            <ToolbarButton primary={false} value={"Electronics"} />
                            <ToolbarButton primary={false} value={"Supplies"} />

                            {categories.map((element, index) => (
                                <ToolbarButton primary={index == 0 ? true : false} value={element.name} key={index} />
                            ))}
                        </div>
                        <div id="controls">
                            <ToolbarButton primary={false} value={"X"} />
                        </div>
                    </section>
                </section>
            </main>
        </div>
    )
}

function ToolbarButton(props) {
    const [filterState, setFilterState] = useState(false);

    let colourStyle = props.primary ? `ring-yellow-500 ${filterState ? '' : 'hover:'}bg-yellow-400 ` : `ring-blue-500 ${filterState ? '' : 'hover:'}bg-blue-500 ${filterState ? '' : 'hover:'}text-white `
    let style = colourStyle + 'ring-2 rounded-2xl px-4 py-1';

    return (
        <button className={style} onClick={() => {setFilterState(!filterState)}}>{props.value}</button>
    )
}
