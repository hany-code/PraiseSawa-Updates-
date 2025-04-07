import React from "react";
import notFound from "../assets/images/notfound.svg";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <img
        src={notFound}
        alt="Not Found"
        className="w-3/4 max-w-md md:w-1/2 lg:w-1/3"
      />
      <h1 className="text-2xl md:text-4xl font-bold mt-8 text-gray-800">
        Page Not Found
      </h1>
      <p className="text-base md:text-lg text-gray-600 mt-4 text-center max-w-xl">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
    </div>
  );
};

export default NotFound;
