import SearchContext from "../authAndContext/searchProvider";
import HorizontalCard from "../components/HorizontalCard";
import VerticalCard from "../components/VerticalCard";
import SearchSideBar from "../components/SearchSideBar"
import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar"
import SortToolbar from "../components/SortToolbar";

export default function SearchPage() {
	const {searchResults, grid} = useContext(SearchContext)
	return (
		<>
			<Navbar />
			<main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 md:min-h-[100vh] overflow-show">
				<SearchSideBar />
				<div className="w-full mt-3">
					<SortToolbar/>
					<div className={grid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5' : ''}>
						{ searchResults && !grid && searchResults.map((result) => (
							<HorizontalCard
								image={result.image}
								title={result.title}
								price={result.price.toLocaleString()}
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