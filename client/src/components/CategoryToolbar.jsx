import React, { useState, useContext } from 'react';
import AuthContext from '../authAndContext/contextApi';
import { RadioGroup } from '@headlessui/react'
import ToolbarButton from './ToolbarButton';

export default function CategoryToolbar({getFunc}) {
    const { categories } = useContext(AuthContext);
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
        getFunc(index)
    }

    return (
        <section className="flex bg-[#fafafb] rounded-lg shadow-md border-2 border-gray justify-between p-4 items-center">
            <div className='flex justify-center items-center px-2 py-2 rounded-xl shadow-md border-neutral-400/30 bg-white text-lg w-full overflow-auto'>
                <RadioGroup value={activeIndex} className={"flex flex-wrap items-center"}>
                    <RadioGroup.Option key={-1} value={null} >
                        {({ checked }) => (
                            <ToolbarButton key={-1} stateID={null} value={"All"} checked={checked} onClick={handleClick} baseStyle={'px-3 py-1 text-sm md:px-4 md:text-base lg:text-lg 2xl:text-xl 2xl:px-6 2xl:py-2 my-1 me-2'}/>
                        )}
                    </RadioGroup.Option>
                    {categories && categories.map((sortKey) => (
                        <RadioGroup.Option key={sortKey.id} value={sortKey.id} >
                            {({ checked }) => (
                                <ToolbarButton key={sortKey.id} stateID={sortKey.id} value={sortKey.name} checked={checked} onClick={handleClick} baseStyle={'px-3 py-1 text-sm md:px-4 md:text-base lg:text-lg 2xl:text-xl 2xl:px-6 2xl:py-2 my-1 me-2'}/>
                            )}
                        </RadioGroup.Option>
                    ))}
                </RadioGroup>
            </div>
        </section>
    );
}
