import React, { useState, useContext } from 'react';
import AuthContext from '../authAndContext/contextApi';
import { RadioGroup } from '@headlessui/react'

export default function CategoryToolbar({getFunc}) {
    const { categories, fetchMyPostings } = useContext(AuthContext);
    const [activeIndex, setActiveIndex] = useState(0);


    function handleClick(index) {
        setActiveIndex(index === activeIndex ? null : index);
        getFunc(index)
    }

    function ToolbarButton({id, value, checked}) {
        return (
            <button className={`flex items-center justify-center ring-2 ring-inset rounded-2xl px-6 py-2 my-1 me-2 md:text-2xl ${checked ? `ring-yellow-500 hover:bg-yellow-400 bg-amber-400` : `ring-sky-600 hover:text-white hover:bg-sky-500`}`} onClick={() => {
                    handleClick(activeIndex === id ? null : id)
                }}>
                <span>{value}</span>
            </button>
        )
    }

    return (
        <section className="flex bg-[#fafafb] rounded-lg shadow-md border-2 border-gray justify-between p-4 items-center mx-3">
            <div className='flex justify-center items-center ps-4 pe-2 rounded-xl shadow-md border-neutral-400/30 bg-white p-2 text-lg w-full overflow-auto'>
                <RadioGroup value={activeIndex} onChange={(e) => {}} className={"flex flex-wrap text-xl items-center"}>
                    <RadioGroup.Option key={-1} value={null} >
                        {({ checked }) => (
                            <ToolbarButton key={-1} id={null} value={"All"} checked={checked}/>
                        )}
                    </RadioGroup.Option>
                    {categories && categories.map((sortKey) => (
                        <RadioGroup.Option key={sortKey.id} value={sortKey.id} >
                            {({ checked }) => (
                                <ToolbarButton key={sortKey.id} id={sortKey.id} value={sortKey.name} checked={checked}/>
                            )}
                        </RadioGroup.Option>
                    ))}
                </RadioGroup>
            </div>
        </section>
    );
}
