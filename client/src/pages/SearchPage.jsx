import SearchContext from "../authAndContext/searchProvider";
import HorizontalCard from "../components/HorizontalCard";
import SearchSideBar from "../components/SearchSideBar"
import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar"

export default function SearchPage() {
	const [grid, setGrid] = useState(false);
	const {searchResults} = useContext(SearchContext)
	return (
		<>
			<Navbar />
			<main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 min-h-[100vh] overflow-show">
				<SearchSideBar />
				<div className="w-full">
					{/* <HorizontalCard
						image={[{file_path:"https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492"}]}
						title={"Mazda RX-7"}
						price={"30,000"}
						location={"Toronto, ON"}
						description={
							"The Mazda RX-7 is an iconic sports car renowned for its unique rotary engine, lightweight chassis, and sleek design. Introduced in 1978, it gained fame for its performance, handling, and affordability in the sports car market. The RX-7, particularly its FD generation, remains a beloved classic among enthusiasts."
						}
						status={{id: 2, type: 'Pending'}}
						postID={1}
						key={1} 
					/> */}
					{ searchResults && searchResults.map((result) => (
						<HorizontalCard
							image={result.image}
							title={result.title}
							price={result.price}
							location={result.location}
							description={
								result.description
							}
							status={{id: result?.status_id ?? 1, type: result.status?.type ?? ''}}
							postID={result.id}
							date={result.created_at}
							key={result.id} 
						/>
					))}
				</div>
			</main>
		</>
	);
}
