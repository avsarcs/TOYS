import React from 'react';
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className={"bg-gradient-to-bl from-50% from-blue-600 via-blue-500 to-red-300"}>
      <div className={`w-5/6 flex m-auto`}>
        <div
          className={"w-full flex flex-row flex-nowrap gap-12 text-gray-200"}>
          <div className={"p-4 flex-0 align-middle"}>
            <span className={"text-4xl font-bold h-full"}>TOYS</span>
          </div>
          <div className="border-2 ml-2 mr-2"></div>
          <div className={"p-2 pl-4 pr-4 flex-1 flex flex-row flex-wrap justify-evenly items-center"}>
            <Link
              className={"min-w-28 p-2 border-2 rounded-xl text-lg text-center transition-colors hover:bg-blue-700"}
              to={"/"}>Dashboard</Link>
            <Link
              className={"min-w-28 p-2 border-2 rounded-xl text-lg text-center transition-colors hover:bg-blue-700"}
              to={"/"}>Calendar</Link>
            <Link
              className={"min-w-24 p-2 border-2 rounded-xl text-lg text-center transition-colors hover:bg-blue-700"}
              to={"/"}>Tours</Link>
          </div>
          <button
            className={"border-l-2 border-r-2 pl-4 pr-6 bg-blue-600 rounded-l-none text-lg transition-colors hover:bg-blue-700"}>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
