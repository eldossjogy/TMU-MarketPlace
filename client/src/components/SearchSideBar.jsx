import React from 'react'
import LocationPicker from './LocationPicker'

export default function SearchSideBar() {
    return (
        <div className='w-full md:w-64 xl:w-80 2xl:w-96 m-3 flex justify-center'>
            <section className='w-full md:w-64 xl:w-80 2xl:w-96 shrink-0 p-4 rounded-lg bg-[#fafafb] border-2 border-gray  flex-col space-y-4 shadow-lg overflow-hidden'>
                <div className='w-full flex-col space-y-2'>
                    <h3 className='text-xl'>Price</h3>
                    <div className='w-full bg-inherit'>
                        <div className="flex items-center px-2 rounded hover:bg-gray-100 ">
                            <input id="checkbox-item-17" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                            <label htmlFor="checkbox-item-17" className="py-1 w-full ms-2 text-sm font-medium text-gray-900 rounded">$20-40</label>
                        </div>
                        <div className="flex items-center px-2 rounded hover:bg-gray-100 ">
                            <input id="checkbox-item-18" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                            <label htmlFor="checkbox-item-18" className="py-1 w-full ms-2 text-sm font-medium text-gray-900 rounded">$20-40</label>
                        </div>
                        <div className="flex items-center px-2 rounded hover:bg-gray-100 ">
                            <input id="checkbox-item-19" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                            <label htmlFor="checkbox-item-19" className="py-1 w-full ms-2 text-sm font-medium text-gray-900 rounded">$20-40</label>
                        </div>
                        <div className="flex items-center px-2 rounded hover:bg-gray-100 ">
                            <input id="checkbox-item-1" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                            <label htmlFor="checkbox-item-1" className="py-1 w-full ms-2 text-sm font-medium text-gray-900 rounded">$20-40</label>
                        </div>
                    </div>
                </div>
                <div></div>
                <div></div>
                <div className="aspect-square" id="map">
                    <LocationPicker />
                </div>
            </section>
        </div>
    )
}
