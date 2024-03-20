import { BarsArrowDownIcon, BarsArrowUpIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import React, { useContext, useState } from 'react'
import SearchContext from '../authAndContext/searchProvider';
import { RadioGroup } from '@headlessui/react'

const states = ['Disabled','Descending','Ascending']
export default function SortToolbar() {
    const {grid, setGrid, sort, sortResults} = useContext(SearchContext);
    const [sortStates, setSortStates] = useState([{id: 0, name:'Name', state: 0}, {id: 1, name:'Price', state: 0}, {id: 2, name:'Date', state: 0}, {id: 3, name:'Distance', state: 0}]);

    const handleResetStates = () => {
        setSortStates([{id: 0, name:'Name', state: 0}, {id: 1, name:'Price', state: 0}, {id: 2, name:'Date', state: 0}, {id: 3, name:'Distance', state: 0}]);
        sortResults(1);
    }

    const handleCycleState = (idx) => {
        setSortStates(
            sortStates.map((sortKey) => {
                if(sortKey.id === idx) {
                    sortResults(sortStates[idx].state === 2 ? idx * 2 : idx * 2 + 1);
                    return { ...sortKey, state: sortStates[idx].state === 2 ? 1 : 2}
                }
                else return { ...sortKey, state: 0};
            })
        )
    }

    const handleToggle = () => {
        setGrid(!grid);
    }

    function ToolbarButton(props) {
        return (
            <button className={`flex items-center justify-center ring-2 ring-inset rounded-2xl px-4 py-1 my-1 text-sm ${props.checked ? `ring-yellow-500 hover:bg-yellow-400 bg-amber-400` : `ring-sky-600 hover:text-white hover:bg-sky-500`}`} onClick={() => {
                    handleCycleState(props.id)
                }}>
                <span>{props.value}</span>
                {props.state.state === 1 ? <BarsArrowDownIcon className='w-4 h-4'/> : props.state.state === 2 ? <BarsArrowUpIcon className='w-4 h-4'/> : ''}
            </button>
        )
    }

    return (
        <section id="search-toolbar" className="flex bg-[#fafafb] rounded-lg shadow-md border-2 border-gray justify-between p-4 items-center mx-3">
            <div id="search-sort" className="flex space-x-2 text-xl items-center">
                <div className='w-auto'>Sort: </div>
                <RadioGroup value={Math.floor(sort, 2)} onChange={(e) => {}} className={"flex flex-wrap space-x-2 text-xl items-center"}>
                    {sortStates && sortStates.map((sortKey) => (
                        <RadioGroup.Option key={sortKey.id} value={sortKey.id} >
                            {({ checked }) => (
                                <ToolbarButton key={sortKey.id} id={sortKey.id} state={sortStates[sortKey.id]} value={sortKey.name} checked={checked}/>
                            )}
                    </RadioGroup.Option>
                    ))}
                </RadioGroup>
            </div>
            <div id="search-controls" className="space-x-2 flex justify-center items-center">
                <button aria-label='Clear Sort' className={`flex items-center ring-0 ring-inset rounded-xl px-2 h-7 text-sm ring-blue-500 ${grid ? 'text-white bg-blue-400' : 'hover:text-white'} hover:text-white hover:bg-blue-500`} onClick={handleToggle}>
                    {grid ? <Squares2X2Icon className='w-4 h-4'/> : <ListBulletIcon className='h-4 w-4'/>}
                </button>
                <button className={`flex items-center ring-0 ring-inset rounded-xl px-2 py-1 text-sm ring-rose-500 hover:text-white hover:bg-rose-500`} onClick={handleResetStates}>
                    <span>X</span>
                </button>
            </div>
        </section>
    )
}
{/* <RadioGroup.Option key={sortKey.id} value={sortKey.name} className={({ active, checked }) => `${active ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300' : ''}
                            ${checked ? 'bg-sky-500/75 text-white' : 'bg-white'} relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`}>
                            {({ checked }) => (
                                
                            )}
                        </RadioGroup.Option> */}