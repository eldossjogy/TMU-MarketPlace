import React from "react";

export default function ErrorPage() {
  return (
      
    <div className="flex flex-col gap-5 justify-center items-center h-[100vh]">
      <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
            <div className="px-4 text-2xl text-gray-500 border-r border-gray-400 tracking-wider">404</div>

            <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">Not Found</div>
        </div>

          
      </div>
      <div className="max-w-xl mx-auto sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        <p className="text-sm mb-4 tracking-wider">
          Oops! The page you are looking for might have been removed, had its
          name changed, or is temporarily unavailable.
        </p>
        <p className="text-sm tracking-wider">
          Return{" "}
          <a href="/" className="text-blue-500">
            Home
          </a>
        </p>
      </div>
    </div>
    // <div className="bg-gray-100">
      



    //   <div className="flex items-center justify-center h-screen">
    //     <div className="bg-white p-8 rounded shadow-md max-w-md">
    //       <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
    //         <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
    //           <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">404 | Not Found</div>
    //         </div>
    //       </div>
    //       <p className="text-lg mb-4">
    //         Oops! The page you are looking for might have been removed, had its
    //         name changed, or is temporarily unavailable.
    //       </p>
    //       <p className="text-lg">
    //         Return to{" "}
    //         <a href="/" className="text-blue-500 underline">
    //           Home Page
    //         </a>
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
}
