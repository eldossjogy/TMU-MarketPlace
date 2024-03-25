import React, { useState, useContext } from 'react';
import AuthContext from '../authAndContext/contextApi';

export default function CategoryComponent({getFunc}) {
    const { categories, fetchMyPostings } = useContext(AuthContext);
    const [activeIndex, setActiveIndex] = useState(0);

    function handleClick(index) {
        setActiveIndex(index === activeIndex ? null : index);
        getFunc(index)
    }

    return (
        <div className='categoryComponentContainer'>
            <ul>
                <li onClick={() => handleClick(0)} className={0 === activeIndex? 'active' : ''}>All</li>
                {categories.map((elem, index) => (
                    <li
                        key={index}
                        onClick={() => handleClick(index + 1)}
                        className={index === activeIndex - 1? 'active' : ''}
                    >
                        {elem.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
