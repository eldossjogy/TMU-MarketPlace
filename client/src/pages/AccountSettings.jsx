import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AuthContext from "../authAndContext/contextApi";

export default function AccountSettings() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { uploadProfilePicture, user } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [postCode, setPostCode] = useState("");

  // use effect updates when user changes
  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setPostCode(user.postal_code);
    }
  }, [user]);


  function updateUserData(){
    if (selectedImage){
      uploadProfilePicture(selectedImage)
    }
  }
  

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center my-3 mx-3">
        <div className="bg-card p-3 rounded-lg w-full max-w-7xl shadow-md">
          <div className="flex justify-evenly">
            {selectedImage && (
              <div>
                {"Selected Image"}
                <img
                  alt="not found"
                  width={"250px"}
                  src={URL.createObjectURL(selectedImage)}
                />
              </div>
            )}
            {user && (
              <div>
                {"Database Image"}
                <img alt="not found" width={"250px"} src={user.avatar_url} />
              </div>
            )}
          </div>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={(event) => {
              setSelectedImage(event.target.files[0]);
            }}
          />

          {user && (
            <>
              <div>
                <label htmlFor="">Username:</label>
                <input
                  type="text"
                  name="username"
                  id=""
                  defaultValue={user.name}
                />
              </div>
              <div>
                <label htmlFor="">Email:</label>
                <input
                  type="text"
                  name="email"
                  id=""
                  defaultValue={user.email}
                  disabled
                />{" "}
                🔒
              </div>
              <div>
                <label htmlFor="">Postal Code:</label>
                <input
                  type="text"
                  name="postalCode"
                  id=""
                  defaultValue={user.postal_code}
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={updateUserData}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
