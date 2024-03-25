import React from 'react'

export default function FormInput(name, type, requirements, text, placeholder, tooltipText, error, errorText) {
  return (
    <div className='flex-col w-[80%]'>
        <label htmlFor={name} className={"block mb-2 text-sm font-medium text-gray-900"}>{text} <span className='text-neutral-400'>{tooltipText}</span></label>
        <input  type={type} name={name}
            className={"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"} 
            placeholder={placeholder} {...requirements}>
        </input>
        {error && <div className={"mb-2 text-sm font-medium text-red-600"}>{errorText}</div>}
    </div>
  )
}
