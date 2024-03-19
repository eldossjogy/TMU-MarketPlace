import SearchContext from "../authAndContext/searchProvider";
import HorizontalCard from "../components/HorizontalCard";
import VerticalCard from "../components/VerticalCard";
import SearchSideBar from "../components/SearchSideBar"
import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar"

export default function SearchPage() {
	const [grid, setGrid] = useState(false);
	const {searchResults} = useContext(SearchContext)

	const toggleGrid = () => {
		setGrid(!grid);
	}

	return (
		<>
			<Navbar />
			<main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 md:min-h-[100vh] overflow-show">
				<SearchSideBar />
				<div className="w-full mt-3">
					<section id="toolbar" className="flex shadow-md bg-[#fafafb] rounded-xl justify-between p-4 items-center mx-3">
						<div id="filters" className="flex flex-wrap space-x-4 text-xl justify-center items-center">
							<ToolbarButton primary={true} value={"Automobiles"} />
							<ToolbarButton primary={false} value={"Textbooks"} />
							<ToolbarButton primary={false} value={"Recently Added"} />
							<ToolbarButton primary={false} value={"Electronics"} />
							<ToolbarButton primary={false} value={"Supplies"} />
						</div>
						<div id="controls" className="space-x-2">
							<ToolbarButton primary={false} value={"View"} clickFn={toggleGrid}/>
							<ToolbarButton primary={false} value={"X"} />
						</div>
					</section>
					<div className={grid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5' : ''}>
						{ searchResults && !grid && searchResults.map((result) => (
							<HorizontalCard
								image={result.image}
								title={result.title}
								price={result.price}
								location={result.location}
								description={result.description}
								status={{id: result?.status_id ?? 1, type: result.status?.type ?? ''}}
								postID={result.id}
								date={result.created_at}
								key={result.id} 
							/>
						))}
						{ searchResults && grid && searchResults.map((result) => (
							<VerticalCard
								image={result.image}
								title={result.title}
								price={result.price.toLocaleString()}
								location={result.location}
								description={result.description}
								postID={result.id}
								key={result.id}
						  />
						))}
					</div>
				</div>
			</main>
		</>
	);
}

function ToolbarButton(props) {
    const [filterState, setFilterState] = useState(false);

    let colourStyle = props.primary ? `ring-yellow-500 ${filterState ? '' : 'hover:bg-yellow-400'} ` : `ring-blue-500 ${filterState ? 'text-white bg-blue-400' : 'hover:text-white'} hover:bg-blue-500 `
    let style = colourStyle + 'ring-2 rounded-2xl px-4 py-1';

    return (
        <button className={style} onClick={() => {setFilterState(!filterState); if(props.clickFn) props.clickFn();}}>{props.value}</button>
    )
}
