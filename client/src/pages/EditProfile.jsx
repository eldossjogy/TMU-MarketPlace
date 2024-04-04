import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../authAndContext/contextApi";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Loading from "../components/Loading";
import MyMarketContainer from "../components/MyMarketContainer";
import NoAvatar from "../assets/noAvatar.jpg"
import toast from "react-hot-toast";

export default function Profile() {
	const [selectedImage, setSelectedImage] = useState(null);
	const {uploadProfilePicture, user} = useContext(AuthContext);
	const [userName, setUserName] = useState("");
	const [postCode, setPostCode] = useState("");
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	// use effect updates when user changes
	useEffect(() => {
		if (user) {
			setUserName(user.name);
			setPostCode(user.postal_code);
		}
	}, [user]);

	function updateUserData() {
		if (selectedImage) {
			uploadProfilePicture(selectedImage)
		}
	}

	function handlePasswordChange() {
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match!")
		}
	}

	return (
		<MyMarketContainer>
			{user ?
			<>
				<div className="bg-card p-6 rounded-lg w-full border border-gray-200 shadow-md flex flex-col space-y-10 justify-center md:min-h-[90vh]">
					<div className="flex flex-wrap sm:flex-nowrap justify-center items-center sm:justify-evenly gap-12 w-full mb-8">
						{selectedImage && (
							<div className="flex max-w-32 lg:max-w-64 flex-wrap justify-center space-y-4">
								<span className="p-1 shadow-md ring-2 rounded-md ring-orange-400">{"New Avatar"}</span>
								<img alt="Not Found" src={URL.createObjectURL(selectedImage)}
									className="aspect-square max-w-32 max-h-32 lg:max-w-64 lg:max-h-64 rounded-full ring-2 ring-orange-600/60 shadow-lg shrink-0 object-cover object-center"
								/>
							</div>
						)}
						{user && (
							<div className="flex max-w-32 lg:max-w-64 flex-wrap justify-center space-y-4">
								<span className="p-1 shadow-md ring-2 rounded-md ring-sky-200">{"Current Avatar"}</span>
								<img alt="Not Found" src={user.avatar_url ? user.avatar_url : NoAvatar}
									className="aspect-square max-w-32 max-h-32 lg:max-w-64 lg:max-h-64 rounded-full ring-2 ring-sky-600/60 shadow-lg shrink-0 object-cover object-center"
								/>
							</div>
						)}
					</div>
					<div className="w-full md:w-96 space-y-4 text-sm md:text-base m-auto">
						<div className='w-full flex flex-col gap-2'>
							<div className="w-full">
								<label htmlFor="avatar" className={`flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer
								border-2 border-gray-300 border-dashed
								bg-gray-50 hover:bg-gray-100 `}>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
											<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
										</svg>
										<p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
										<p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG</p>
									</div>
									<input
										type="file"
										id="avatar"
										name="avatar"
										accept="image/png, image/jpeg"
										multiple
										onChange={(e) => {setSelectedImage(e.target.files[0]);}}
										className='hidden'
									/>
									
								</label>
							</div>
							{selectedImage && (
								<div className="p-4 rounded-md ring-inset ring-1 ring-orange-400/65">
									<div className="w-full text-gray-600 truncate">{selectedImage.name}</div>
								</div>
							)}								
						</div>
						<div className="flex items-center w-full justify-between">
							<label htmlFor="username" className="min-w-24">Username:</label>
							<input
								type="text"
								name="username"
								defaultValue={user.name}
								className="max-w-64 w-full rounded-lg"
							/>
						</div>
						<div className="flex items-center w-full justify-between">
							<label htmlFor="first_name" className="min-w-24">First Name:</label>
							<input
								type="text"
								name="first_name"
								placeholder="(not set)"
								defaultValue={user.first_name}
								className="max-w-64 w-full rounded-lg"
							/>
						</div>
						<div className="flex items-center w-full justify-between">
							<label htmlFor="last_name" className="min-w-24">Last Name:</label>
							<input
								type="text"
								name="last_name"
								placeholder="(not set)"
								defaultValue={user.last_name}
								className="max-w-64 w-full rounded-lg"
							/>
						</div>
						<div className="flex items-center w-full justify-between">
							<label htmlFor="email" className="min-w-24">Email:</label>
							<div className="relative w-full max-w-64">
								<input
									type="text"
									name="email"
									id=""
									defaultValue={user.email}
									className="w-full rounded-lg text-gray-500"
									disabled
								/>
								<div className="absolute inset-y-0 end-0 top-0 flex items-center pointer-events-none px-2.5">🔒</div>
							</div>
						</div>
						<div className="flex items-center w-full justify-between">
							<label htmlFor="postalCode" className="min-w-24">Postal Code:</label>
							<div className="relative w-full max-w-64 ">
								<input
									type="text"
									name="postalCode"
									placeholder="(not set)"
									defaultValue={user.postal_code}
									className=" w-full rounded-lg  text-gray-500"
								/>
								<span className="absolute inset-y-0 end-0 top-0 flex items-center pointer-events-none px-2" ><MapPinIcon className="w-6 h-6 text-sky-500 hover:text-sky-600"/></span>
							</div>
							
						</div>
					</div>
					<div className="w-full md:w-96 justify-end flex m-auto">
						<button type="submit" className="bg-[#F9B300] hover:bg-[#f9a200] text-gray-900 font-bold py-2 px-8 sm:px-12 rounded-md shadow-md" onClick={updateUserData}>
							Update
						</button>
					</div>
				</div>
				<div className="bg-card p-6 rounded-lg w-full border border-gray-200 shadow-md flex flex-col space-y-10 justify-center">
					
					<div className="w-full md:w-96 space-y-4 text-sm md:text-base m-auto">
						<div className="flex items-center w-full justify-between">
							<label htmlFor="password" className="min-w-24">New Password:</label>
							<input
								type="password"
								name="password"
								className="max-w-64 w-full rounded-lg"
								onChange={e => setNewPassword(e.target.value)}
							/>
						</div>
						<div className="flex items-center w-full justify-between">
							<label htmlFor="first_name" className="min-w-24">Confirm New Password:</label>
							<input
								type="password"
								name="confirmPassword"
								className="max-w-64 w-full rounded-lg"
								onChange={e => setConfirmPassword(e.target.value)}
							/>
						</div>
						
					</div>
					<div className="w-full md:w-96 justify-end flex m-auto">
						<button type="submit" className="bg-[#F9B300] hover:bg-[#f9a200] text-gray-900 font-bold py-2 px-8 sm:px-12 rounded-md shadow-md" onClick={handlePasswordChange}>
							Change Password
						</button>
					</div>
				</div>
			</>
			: <Loading />
			}
		</MyMarketContainer>
	);
}