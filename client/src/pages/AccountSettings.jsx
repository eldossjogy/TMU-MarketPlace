import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AuthContext from "../authAndContext/contextApi";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Loading from "../components/Loading";

export default function AccountSettings() {
	const [selectedImage, setSelectedImage] = useState(null);
	const { uploadProfilePicture, user} = useContext(AuthContext);
	const [userName, setUserName] = useState("");
	const [postCode, setPostCode] = useState("");

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

	return (
		<>
			{user ?
				<div className="flex justify-center items-center mt-4 mx-3">
					<div className="bg-card p-3 rounded-lg w-full max-w-7xl shadow-md flex flex-wrap space-y-10 justify-center items-center">
						<div className="flex justify-evenly w-full">
							{selectedImage && (
								<div className="flex w-[250px] flex-wrap justify-center space-y-4">
									<span className="p-1 shadow-md ring-2 rounded-md ring-orange-400">{"Selected Image"}</span>
									<img alt="Not Found" width={"250px"} src={URL.createObjectURL(selectedImage)}
										className="h-[250px] rounded-full ring-2 ring-orange-600/60 shadow-lg shrink-0 object-cover object-center"
									/>
								</div>
							)}
							{user && (
								<div className="flex w-[250px] flex-wrap justify-center space-y-4">
									<span className="p-1 shadow-md ring-2 rounded-md ring-sky-200">{"Database Image"}</span>
									<img alt="Not Found" width={"250px"} src={user.avatar_url}
										className="h-[250px] rounded-full ring-2 ring-sky-600/60 shadow-lg shrink-0 object-cover object-center"
									/>
								</div>
							)}
						</div>
						<div className="space-y-4 w-full p-8">
							<input
								type="file"
								id="avatar"
								name="avatar"
								accept="image/png, image/jpeg"
								onChange={(event) => {
									setSelectedImage(event.target.files[0]);
								}}
								className=" text-stone-500
								file:mr-8 file:py-1 file:px-4 file:border-[1px] file:border-sky-400 file:w-32 file:rounded-lg
								file:text-sm file:font-medium
								file:bg-stone-100 file:text-stone-700
								hover:file:cursor-pointer hover:file:bg-sky-400
								hover:file:text-white w-full"
								
							/>

							{user && (
								<>
									<div className="flex items-center w-full">
										<label htmlFor="username" className="w-32 mr-5">Username:</label>
										<input
											type="text"
											name="username"
											id=""
											defaultValue={user.name}
											className="w-64 rounded-lg"
										/>
									</div>
									<div className="flex items-center w-full">
										<label htmlFor="email" className="w-32 mr-5">Email:</label>
										<input
											type="text"
											name="email"
											id=""
											defaultValue={user.email}
											className="w-64 rounded-lg"
											disabled
										/>{" "}
										<span className="relative right-8" >🔒</span>
									</div>
									<div className="flex items-center w-full">
										<label htmlFor="postalCode" className="w-32 mr-5">Postal Code:</label>
										<input
											type="text"
											name="postalCode"
											id=""
											defaultValue={user.postal_code}
											className="w-64 rounded-lg"
										/>
										<span className="relative right-9 w-6 h-6" ><MapPinIcon className="text-blue-500 hover:text-blue-700"/></span>
									</div>
								</>
							)}
							<button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md sha" onClick={updateUserData}>
								Update
							</button>
						</div>
					</div>
				</div>
			: <Loading />
			}
		</> 
	);
}