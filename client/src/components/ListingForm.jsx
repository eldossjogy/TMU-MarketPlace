import React, { useContext, useState, useEffect } from 'react'; import AuthContext from '../authAndContext/contextApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingScreen from './LoadingScreen';
import LocationContext from '../authAndContext/locationProvider';
import "../index.css";

export default function ListingForm({formDataProp = {
    title: '',
    price: '',
    description: '',
    expire_time: null,
    postal_code: '',
    location: '',
	lat: null,
	lng: null,
    category_id: 2,
}, typeOfReq="Post", editingForm=false}) {
    const { createNewListing, loadingState, setLoadingState, categories, updateListing } = useContext(AuthContext);
	const { location, city, generateLocation, searchForLocation, searchingLocation } = useContext(LocationContext);
	
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({})

	const [formData, setFormData] = useState(formDataProp);
	const [imageList, setImageList] = useState([]);
	const [selectedImages, setSelectedImages] = useState([]);

	// Location Search Variables
	const [noResults, setNoResults] = useState(false);
	// const [postCoordinates, setPostCoordinates] = useState(location);

    useEffect(() => {
      const loadImages = async () => {
          const imageDataURLs = [];
          for (const image of imageList) {
              const dataURL = await readFileAsDataURL(image);
              imageDataURLs.push(dataURL);
          }
          setSelectedImages(imageDataURLs);
      };
  
      loadImages();
  	}, [imageList]);

	useEffect(() => {
		if (!formDataProp.location) {
			setFormData(prevState => ({
				...prevState,
				location: city,
				lat: location.lat,
				lng: location.lng
			}));
		}
	}, [])

    // Function to read file as data URL (base64)
    const readFileAsDataURL = (file) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
      });
    };

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
		const price = parseInt(formData.price);
		if (isNaN(price)) {
			setFormData(prev => ({ ...prev, price: 0 }))
		}
		else if (price < 0 || price > 100000) {
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
		if(!formData.lat || !formData.lng){
			errors.coordinates = 'Coords missing.'
			console.log('Coords missing');
			setNoResults(true);
		}
		else if(!formDataProp.location && !formData.location) {
			// console.log('have coords but dont have a user input location, and there was no given location so set to default')
		}
		else if(!formData.location){
			// console.log('have coords but dont have a user input location, but there was given location so something is wrong')
			errors.location = 'Location is required.'
		}


		console.log(formData);
		return errors;
	}

	function handleDrop(event) {
		event.preventDefault();
		const files = event.dataTransfer.files;

		//check if files are images or not:
		checkFileForImage(files)
	}

	function handleChange(e) {
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
			
			if (typeOfReq === "Post") {
				setLoadingState(true);
				await createNewListing({ ...formData, location: !formDataProp.location && !formData.location ? city : formData.location,  expire_time: getCurrentDateTime(48) }, imageList);
			}
			else if (typeOfReq === "Put") {
				setLoadingState(true);
				await updateListing({...formData, expire_time: getCurrentDateTime(48)}, imageList)
			}
		}
	};

	function checkFileForImage(files) {
		setSelectedImages([]);

		if (files.length <= 4) {
			const imageArr = [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file.type.startsWith('image/')) {
					imageArr.push(file);
				} else {
					toast.error('Only image files are supported.');
				}
			}
			setImageList([...imageArr]);
		} else {
			toast.error("Limit 4 Images");
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

		const fileInput = document.getElementById('dropzone-file');
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function handleUploadedImageDelete(index) {
		const newImageArr = [...formData.image];
		const filteredImageArr = newImageArr.filter((item, i) => i !== index);
		console.log(filteredImageArr);
		setFormData(prev => ({ ...prev, image: filteredImageArr }));
	
		const fileInput = document.getElementById('dropzone-file');
		if (fileInput) {
			fileInput.value = '';
		}
	}

	const handleLocationSearch = async (e) => {
		e.preventDefault();
		toast("Searching for Location")

		const form = new FormData(e.target);
		const query = form.get('location');
		const results = await searchForLocation(query, {getAddress: true}); // Search for a map location given a user query

		if (results) { // If there are results
			setNoResults(false);
			setFormErrors(prevState => ({
				...prevState,
				location: '',
				coordinates: ''
			}));
			generateLocation({ lat: results.lat, lng: results.lng }); // Set user location to search result
			
			if(results.address){
				console.log(results.address);
				setFormData(prevState => ({
					...prevState,
					location: `${results.address.City ? `${results.address.City}, ` : ''}${results.address.RegionAbbr}`,
					lat: results.lat,
					lng: results.lng
				}));
			}
			else{
				setFormData(prevState => ({
					...prevState,
					location: results.name,
					lat: results.lat,
					lng: results.lng
				}));
			}
			// setPostCoordinates({ lat: results.lat, lng: results.lng });
		}
		else { // No search results for user location query
			toast.error("No location results.")
			setNoResults(true);
		}
	};

	return (
		<>
			<section className="flex flex-col md:px-8 rounded-lg space-y-4 mt-2">
				{editingForm ? <h1 className='text-5xl'>Edit Listing</h1> : <h1 className='text-5xl'>Create Listing</h1>}
				<div className='flex flex-wrap w-full space-y-4'>
					<div className='w-full space-y-2'>
						<label className="block">Title: <span className='text-red-500'>{formErrors.title} *</span></label>
						<input autoComplete='off' type="text" name="title" 
							value={formData.title} onChange={handleChange} placeholder="Enter Title" required maxLength={150}
							className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
						/>

						<label className="block">Price: <span className='text-red-500'>{formErrors.price} *</span></label>
						<div className="relative">
                            <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none ">$</div>
                            <input type='text' name='price' maxLength={20} required
								className={`ps-7 py-2 rounded-md w-full border-gray-300`} 
								placeholder='Enter Price' value={formData.price} 
                                onChange={(e) => { 
                                    let val = parseInt(e.target.value)
                                    if(isNaN(val)){
                                        setFormData(prevState => ({
											...prevState,
											["price"]: ''
										}));
                                        return;
                                    }

									setFormData(prevState => ({
										...prevState,
										["price"]: val
									}));
                                }
                            }></input>
                        </div>
						<form onSubmit={handleLocationSearch}>
							<label className="block">
								Set Location&nbsp;
								<span className='text-neutral-400'>{noResults || formErrors.location ? '' : '(press enter to search)'}</span>:
								<span className='text-red-500'>{noResults ? 'Invalid location, try again': formErrors.location} *</span>
							</label>
							<input
								className={`w-full rounded-md border-gray-300 ring-red-600 ring-opacity-30 ${noResults || formData.lat === null || formData.lng === null ? 'ring-2 border-red-600 focus:ring-red-400 focus:border-red-600' : searchingLocation ? 'ring-2 border-amber-500 focus:ring-amber-400 focus:border-amber-600' : ''}`}
								type="text" name="location" placeholder={formData.lat ? formData.location ? formData.location : city : 'Not Set'} value={formData.location} required
								onChange={(e) => {
									if (formData.lat || formData.lng) {
										setFormData(prevState => ({
											...prevState,
											lat: null,
											lng: null
										}));
									}
									handleChange(e);
								}}
								disabled={searchingLocation}
							></input>
						</form>

						<label className="block">Category: <span className="text-red-500">{formErrors.category_id} *</span></label>
						<select name="category_id" value={formData.category_id} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4">
							{categories.map((elem, index) => (
								<option key={index} value={elem.id}>{elem.name}</option>
							))}
						</select>

						<label className="block">Description (max 350 characters): {<span className='text-red-500'>{formErrors.description} *</span>}</label>
						<textarea rows="3" name="description" maxLength={350} value={formData.description} onChange={handleChange} className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4"></textarea>
					</div>

					<div className='sm:w-full lg:w-[50%]'>
						<div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
							<label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer
							border-2 border-gray-300 border-dashed
							bg-gray-50 hover:bg-gray-100 `}>
							{/* dark:border-gray-600 dark:hover:border-gray-500
							dark:bg-gray-700 dark:hover:bg-gray-600 */}
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
										<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
									</svg>
									<p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG</p>
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
							{selectedImages.map((elem, index) => (
								<li className='relative selectedImageBox overflow-hidden' key={index}>
									<img className="w-full" src={elem}></img>
									<i className="absolute right-1 p-2 text-red-500" onClick={() => handleImageDelete(index)}>&#x2715;</i>
								</li>
							))}
							{formData.image?.map((elem, index) => (
								<li className='relative selectedImageBox overflow-hidden flex' key={index}>
									<img className="w-full" src={elem.file_path}></img>
									<i className="absolute right-1 p-2 text-red-500" onClick={() => handleUploadedImageDelete(index)}>&#x2715;</i>
								</li>
							))}
						</ul>
					</div>
				</div>
				<form className='flex justify-center md:justify-start space-x-8 md:w-[50%] text-xl mb-3' onSubmit={handleNewPost} >
					<button type="submit" className="bg-indigo-500 text-white py-2 px-8 rounded-md hover:bg-indigo-600 mb-3">Post</button>
					<button type="button" onClick={() => navigate('/my-market')} className="bg-red-500 text-white py-2 px-8 rounded-md hover:bg-red-600 mb-3">Cancel</button>
				</form>
			</section>
			{loadingState &&
				(editingForm==false ? <LoadingScreen message={"Creating new Listing..."} /> : <LoadingScreen message={"Updating Listing..."} />)
			}
		</>

	)
}
