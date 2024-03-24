import React, { useContext, useEffect } from 'react'
import MyMarketContainer from '../components/MyMarketContainer'
import SearchContext from '../authAndContext/searchProvider'
import HorizontalCard from '../components/HorizontalCard';
import VerticalCard from '../components/VerticalCard';
import SortToolbar from '../components/SortToolbar';

export default function HistoryPage() {
    const {userHistory, getUserHistory, historySort, sortHistory, grid} = useContext(SearchContext);
    useEffect(() => {
        getUserHistory();
    }, [])


    
    return (
        <MyMarketContainer>
            {/* {userHistory && userHistory.map((entry) => (
                <div key={entry.ad_id}><div>{entry.title}</div><div>{entry.created_at}</div></div>
            ))} */}
            <SortToolbar customSortKey={historySort} sortResultsFn={sortHistory} defaultSortState={[{id: 0, name:'Date', state: 0}]}/>
            <div className={userHistory?.length !== 0 && grid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5' : ''}>
                {userHistory && userHistory.length !== 0 && userHistory.map((result) => (
                    <HorizontalCard
                        image={result.ad?.image ?? []}
                        title={result.ad?.title ?? result.ad_id}
                        price={result.ad?.price.toLocaleString()}
                        location={''}
                        description={result.ad?.description}
                        status={{ id: result?.ad?.status_id ?? 1, type: result.ad?.status?.type ?? '' }}
                        postID={result.ad_id}
                        date={result.created_at}
                        distance={''}
                        key={result.ad_id}
                    />
                ))}
                {userHistory && grid && userHistory.length !== 0 && userHistory.map((result) => (
                    <VerticalCard
                        image={result.ad.image}
                        title={result.ad.title}
                        price={result.ad.price.toLocaleString()}
                        location={''}
                        description={result.ad.description}
                        postID={result.ad_id}
                        distance={0}
                        key={result.id}
                    />
                ))}
                {!userHistory || (userHistory && userHistory.length === 0) && [1].map((key) => (
                    <div key={key} className="m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72 overflow-hidden">
                        <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                            <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
                                <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">No Results</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </MyMarketContainer>
    )
}
