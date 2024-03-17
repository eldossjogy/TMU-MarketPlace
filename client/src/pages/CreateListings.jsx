import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AuthContext from '../authAndContext/contextApi';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen'
import toast from 'react-hot-toast';
import MyProfileContainer from '../components/MyProfileContainer';

export default function CreateListings() {
    const { createNewListing, loadingState, setLoadingState, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        expire_time: getCurrentDateTime(48),
        postal_code: '',
        location: '',
        category_id: '',
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNewPost = async (event) => {
        event.preventDefault();
        setLoadingState(true);
        await createNewListing(formData, imageList);
    };

    const checkFileForImage = (files) => {
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

    return (
        <div>
            <Navbar />
            <MyProfileContainer>
            <form onSubmit={handleNewPost} className="createListingForm p-8 bg-white shadow-lg rounded-lg">
                <div className='leftFormSection'> 
                    <div class="imageUploadSection">
                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
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
                    <div>
                        <h1>Images Selected:</h1>
                        {selectedImages.map((elem, index) => (
                            <img src={elem} key={index}></img>
                        ))}
                    </div>
                    
                </div>
                <div className='rightFormSection'>
                    <label className="block mb-2">Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter Title" className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                    <label className="block mb-2">Price:</label>
                    <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Enter Price" className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                    <label className="block mb-2">Postal Code:</label>
                    <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Enter Postal Code" className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                    <label className="block mb-2">Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter Location" className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                    <label className="block mb-2">Category ID:</label>
                    <input type="text" name="category_id" value={formData.category_id} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                    <label className="block mb-2">Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2"></textarea>
                    
                    <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">Submit</button>
                </div>
            </form>

            </MyProfileContainer>
            {loadingState &&
                <LoadingScreen message={"Creating new Listing..."} />
            }
        </div>
    );
}
