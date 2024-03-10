import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AuthContext from '../authAndContext/contextApi';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen'

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
        user_id: user?.id || ''
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
                    alert('Please select image files only!!');
                }
            }
            setImageList([...imageArr]);
        } else {
            alert("Please seelect max 4 images!!!");
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
        <div className="flex flex-col items-center justify-center">
            <Navbar />
            <form onSubmit={handleNewPost} className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
                <label className="block mb-2">Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                <label className="block mb-2">Price:</label>
                <input type="text" name="price" value={formData.price} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                <label className="block mb-2">Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2"></textarea>

                <label className="block mb-2">Postal Code:</label>
                <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                <label className="block mb-2">Location:</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                <label className="block mb-2">Category ID:</label>
                <input type="text" name="category_id" value={formData.category_id} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4 p-2" />

                <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">Submit</button>
            
                <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept=".jpg, .png, .jpeg"
                    multiple
                    onChange={(e) => checkFileForImage(e.target.files)}
                    className="mt-8"
                />
            </form>

            {loadingState &&
                <LoadingScreen message={"Creating new Listing..."} />
            }
        </div>
    );
}
