import { BarsArrowDownIcon, BarsArrowUpIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import React, { useContext, useState } from 'react'
import SearchContext from '../authAndContext/searchProvider';
import { RadioGroup } from '@headlessui/react'

const states = ['Disabled','Descending','Ascending']
export default function SortToolbar() {
    const {grid, setGrid, sort, setSort} = useContext(SearchContext);
    const [sortStates, setSortStates] = useState([{id: 0, name:'Name', state: 0}, {id: 1, name:'Price', state: 0}, {id: 2, name:'Date', state: 0}, {id: 3, name:'Status', state: 0}]);

    const handleResetStates = () => {
        setSortStates([{id: 0, name:'Name', state: 0}, {id: 1, name:'Price', state: 0}, {id: 2, name:'Date', state: 0}, {id: 3, name:'Status', state: 0}]);
        setSort(0);
    }

    const handleCycleState = (idx) => {
        setSortStates(
            sortStates.map((sortKey) => {
                if(sortKey.id === idx) return { ...sortKey, state: sortStates[idx].state === 2 ? 1 : 2}
                else return { ...sortKey, state: 0};
            })
        )
    }

    const handleToggle = () => {
        setGrid(!grid);
    }

    function ToolbarButton(props) {
        return (
            <button className={`flex items-center justify-center space-x-2 ring-2 ring-inset rounded-2xl px-4 py-1 my-1 text-sm ${props.state.state > 0 ? `ring-yellow-500 hover:bg-yellow-400 bg-amber-400` : `ring-blue-500 hover:text-white hover:bg-blue-500`}`} onClick={() => {
                    handleCycleState(props.id)
                }}>
                <span>{props.value}</span>
                {props.state.state === 1 ? <BarsArrowDownIcon className='w-4 h-4'/> : props.state.state === 2 ? <BarsArrowUpIcon className='w-4 h-4'/> : ''}
            </button>
        )
    }
    
    function ToolbarControl(props = {value: '', clickFn: () => {}, state: false, icons: {positive: 'd', negative: 'f'}}) {
        return (
            <button className={`flex items-center ring-2 rounded-2xl px-4 py-1 space-x-2 text-sm ring-blue-500 ${props.state ? 'text-white bg-blue-400' : 'hover:text-white'} hover:bg-blue-500`} onClick={() => {
                    if(props.clickFn)  props.clickFn();           
                }}>
                <span>{props.value}</span>
            </button>
        )
    }

    return (
        <section id="search-toolbar" className="flex shadow-md bg-[#fafafb] rounded-xl justify-between p-4 items-center mx-3">
            <div id="search-sort" className="flex space-x-2 text-xl items-center">
                <div className='w-auto'>Sort: </div>
                <RadioGroup value={sort} onChange={(e) => {setSort(e); console.log(e);}} className={"flex flex-wrap space-x-2 text-xl items-center"}>
                    {sortStates && sortStates.map((sortKey) => (
                        <RadioGroup.Option key={sortKey.id} value={sortKey.id} >
                            {({ checked }) => (
                                <ToolbarButton key={sortKey.id} id={sortKey.id} state={sortStates[sortKey.id]} value={sortKey.name} className={`${checked ? 'bg-sky-500/75 text-white' : 'bg-white'}`}/>
                                // <button className={`flex items-center justify-center space-x-2 ring-2 ring-inset rounded-2xl px-4 py-1 my-1 text-sm ${sortStates[sortKey].state > 0 ? `ring-yellow-500 hover:bg-yellow-400 bg-amber-400` : `ring-blue-500 hover:text-white hover:bg-blue-500`}`} onClick={() => {
                                //     handleCycleState(sortKey.id)
                                // }}>
                                //     <span>{sortKey.name}</span>
                                //     {sortStates[sortKey].state === 1 ? <BarsArrowDownIcon className='w-4 h-4'/> : sortStates[sortKey].state === 2 ? <BarsArrowUpIcon className='w-4 h-4'/> : ''}
                                // </button>
                            )}
                    </RadioGroup.Option>
                    ))}
                </RadioGroup>
            </div>
            <div id="search-controls" className="space-x-2 flex justify-center items-center">
                <button aria-label='Clear Sort' className={`flex items-center ring-2 ring-inset rounded-2xl px-4 h-7 text-sm ring-blue-500 ${grid ? 'text-white bg-blue-400' : 'hover:text-white'} hover:text-white hover:bg-blue-500`} onClick={handleToggle}>
                    {grid ? <Squares2X2Icon className='w-4 h-4'/> : <ListBulletIcon className='h-4 w-4'/>}
                </button>
                <button className={`flex items-center ring-2 ring-inset rounded-2xl px-4 py-1 text-sm ring-blue-500 hover:text-white hover:bg-blue-500`} onClick={handleResetStates}>
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