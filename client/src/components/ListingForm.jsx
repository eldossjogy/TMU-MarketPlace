import React, { useContext, useState, useEffect } from 'react';import AuthContext from '../authAndContext/contextApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingScreen from './LoadingScreen';

export default function ListingForm({formDataProp = {
    title: '',
    price: '',
    description: '',
    expire_time: null,
    postal_code: '',
    location: '',
    category_id: null,
}}, typeOfReq="Post") {

    const { createNewListing, loadingState, setLoadingState, categories } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({})

    const [formData, setFormData] = useState(formDataProp);

    const [imageList, setImageList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        if (imageList.length !== 0) {
            const imgList = Array.from(imageList);
            
            imgList.forEach((image) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    setSelectedImages(prev => [...prev, e.target.result]);
                };
                reader.readAsDataURL(image);
            });
        }
    }, [imageList]);

    //function that returns array of errors for form valdation
    function validateFormData(formData) {
        const errors = {};
    
        // Title validation
        if (!formData.title.trim()) {
            errors.title = 'Title is required.';
        } else if (formData.title.length > 100) {
            errors.title = 'Title must be at most 100 characters long.';
        }
    
        // Price validation
        const price = parseFloat(formData.price);
        if (isNaN(price)) {
            setFormData(prev => ({...prev, price: "0"}))
        }
        else if (!/^\d+(\.\d{1,2})?$/.test(formData.price.toString().trim())) {
            errors.price = 'Price must be a valid number.';
        }
        else if (price < 0 || price > 100000 || !formData.price.toString().trim()) {
            errors.price = 'Price must be a number between $0 and $100,000.';
        }
    
        // Description validation
        if (!formData.description.trim()) {
            errors.description = 'Description is required.';
        }
        else if (formData.description.length > 350) {
            errors.description = 'Description must be at most 350 characters long.';
        }
    
        // Postal code validation
        if (formData.postal_code && !/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(formData.postal_code)) {
            errors.postal_code = 'Invalid Canadian postal code format.';
        }
    
        // Category ID validation
        if (formData.category_id === null) {
            errors.category_id = 'Category is required.';
        }

        //location validation
        if (formData.location.length > 150) {
            errors.location = 'Location must be at most 150 characters long.';
        }
    
    
        return errors;
    }

    function handleDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;

        //check if files are images or not:
        checkFileForImage(files)
    }

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    async function handleNewPost(event) {
        event.preventDefault();
        
        let err = validateFormData(formData)
        setFormErrors(err)

        if (Object.keys(err).length === 0) {
            setLoadingState(true);
            if (typeOfReq === "Post") {
                await createNewListing({...formData, expire_time: getCurrentDateTime(48)}, imageList);
            }
            else if (typeOfReq === "Put") {
                alert("yet to implement this function")
            }
        }
    };

    function checkFileForImage(files) {
        setSelectedImages([])

        if (files.length <= 4) {
            const imageArr = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    imageArr.push(file);
                } else {
                    toast.error('Please select image files only!!');
                }
            }
            setImageList([...imageArr]);
        } else {
            toast.error("Please seelect max 4 images!!!");
        }
    };

    function getCurrentDateTime(offset) {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + offset);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDateTime = `${year}-${month}-${day} ${hours % 12}:${minutes}:${seconds} ${ampm}`;
        return formattedDateTime;
    }

    function handleImageDelete(img) {
        const index = imageList.indexOf(img)

        setImageList(prev => prev.filter((item, i) => i !== index));
    }


  return (
    <>
    <form onSubmit={handleNewPost} className="createListingForm p-8 bg-white shadow-md rounded-lg">
      <h1 className='formTitle'>Create A New Listing</h1>
      <div className='topFormSection'>
        <div className='leftFormSection'>
          <label className="block mb-2">Title:{formErrors.title && <span className='text-red-500'>{formErrors.title}</span>}</label>
          <input autoComplete='off' type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter Title" className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />
  
          <label className="block mb-2">Price:{formErrors.price && <span className='text-red-500'>{formErrors.price}</span>}</label>
          <div className="relative">
            <span className="rounded-md absolute inset-y-0 left-0 p-3 flex items-center bg-gray-200 text-gray-600">$</span>
            <input autoComplete="off" type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Enter Price ($0 if not set)" className="rounded-md pl-10 pr-12 block w-full border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" style={{ backgroundColor: 'white' }} />
            <span className="rounded-md absolute inset-y-0 right-0 p-3 flex items-center bg-gray-200 text-gray-600">.00</span>
          </div>
  
          <label className="block mb-2">Postal Code:{formErrors.postal_code && <span className='text-red-500'>{formErrors.postal_code}</span>}</label>
          <input autoComplete="off" type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Enter Postal Code" className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />
  
          <label className="block mb-2">Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter Location" className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />
  
          <label className="block mb-2">Category:{formErrors.category_id && <span className='text-red-500'>{formErrors.category_id}</span>}</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2">
            <option value="">Select Category</option>
            {categories.map((elem, index) => (
              <option key={index} value={elem.id}>{elem.name}</option>
            ))}
          </select>
  
          <label className="block mb-2">Description:{formErrors.description && <span className='text-red-500'>{formErrors.description}</span>}</label>
          <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2"></textarea>
        </div>
  
        <div className='rightFormSection'> 
          <div className="imageUploadSection" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input
                type="file"
                id="dropzone-file"
                name="avatar"
                accept=".jpg, .png, .jpeg"
                multiple
                onChange={(e) => checkFileForImage(e.target.files)}
                className='hidden'
              />
            </label>
          </div> 
          <ul className='selectedImageDisplayContainer'>
            <h1>Images Selected:</h1>
            {imageList.map((elem, index) => (
              <li className='selectedImageBox' key={index}>
                <p>{elem.name}</p>
                <i onClick={() => handleImageDelete(elem)}>&#x2715;</i>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='bottomFormSection'>
        <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">Post</button>
        <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Cancel</button>
      </div>
    </form>
    {loadingState &&
      <LoadingScreen message={"Creating new Listing..."} />
    }
  </>

  )
}
