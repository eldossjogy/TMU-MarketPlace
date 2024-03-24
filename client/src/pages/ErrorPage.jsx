import React from "react";

export default function ErrorPage() {
  return (
    <div className="bg-gray-100">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded shadow-md max-w-md">
          <h1 className="text-3xl text-red-600 font-semibold mb-4">
            Error 404 - Page Not Found
          </h1>
          <p className="text-lg mb-4">
            Oops! The page you are looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>
          <p className="text-lg">
            Return to{" "}
            <a href="/" className="text-blue-500 underline">
              Home Page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
