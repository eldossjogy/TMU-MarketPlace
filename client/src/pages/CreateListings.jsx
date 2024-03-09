import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../authAndContext/contextApi'

export default function CreateListings() {

    const { loadingState, setLoadingState } = useContext(AuthContext)
    const navigate = useNavigate()
    const [postTitle, setPostTitle] = useState('')
    const [postDescription, setPostDescription] = useState('')
    const [imageList, setImageList] = useState([])
    const [selectedImages, setSelectedImages] = useState([]);
    let bool = true

    useEffect(() => {

        if (imageList.length !== 0) {
            //converting the fileList object (array, but dont use array functions such as .forEach()) to an array
            const imgList = Array.from(imageList)

            imgList.forEach((image) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    setSelectedImages(prev => [...prev, e.target.result])
                };

                reader.readAsDataURL(image)
            });
        }

    }, [imageList])

    const handleNewPost = async (event) => {

        event.preventDefault()
        if (postDescription.length === 0 || postTitle === 0) {
           alert('Please enter post title and description')
        }
        else {
            setLoadingState(true)
            //await createNewPostReq(postDescription, postTitle, imageList)
            alert("came here")
        }

    }

    const checkFileForImage = (files) => {
        if (files.length <= 4) {
            const imageArr = []
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    imageArr.push(file)
                }
                else {
                    alert('Please select image files only!!')
                }
            }
            setImageList([...imageArr])
        }
        else {
            alert("Please seelect max 4 images!!!")
        }
    }

  return (
    <div>
        <Navbar />
        <div>
            <input
                type="file"
                id="avatar"
                name="avatar"
                accept=".jpg, .png, .jpeg"
                multiple
                onChange={(e) => checkFileForImage(e.target.files)} 
            />
        </div>
        {loadingState &&
            <div className="editItemModalContainer2 flex justify-center items-center flex-col">
                <svg aria-hidden="true" className="inline w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <div className='text-white mt-[5%] text-2xl md:text-3xl md:mt-[2%]'>
                    Creating new Post...
                </div>     
            </div>
        }

    </div>
  )
}
