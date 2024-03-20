import React, { useState, useContext } from 'react';
import AuthContext from '../authAndContext/contextApi';

export default function CategoryComponent() {
    const { categories } = useContext(AuthContext);
    const [activeIndex, setActiveIndex] = useState(null);

    function handleClick(index) {
        setActiveIndex(index === activeIndex ? null : index);
    }

    return (
        <div className='categoryComponentContainer'>
            <ul>
                {categories.map((elem, index) => (
                    <li
                        key={index}
                        onClick={() => handleClick(index)}
                        className={index === activeIndex ? 'active' : ''}
                    >
                        {elem.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
