import React from "react";

const Header = () => {
  return (
    <header className="bg-primary text-white p-2 m-2 px-8 flex justify-between rounded-lg items-center">
      <input
        type="text"
        placeholder="Search"
        className="p-1 px-4 w-1/3 rounded-md text-gray-700"
      />
      <div className="rounded-full w-10 h-10 bg-gray-200"></div>
    </header>
  );
};

export default Header;
