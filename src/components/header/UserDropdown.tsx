import { useState } from "react";
import { Link } from "react-router";
import Alert from '../../icons/alert.svg'
export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >


        <span className="block mr-1 text-white text-lg">Hi, Alex!</span>
       
        <Link to="/profile-salesperson">
          <span className="mr-3 ms-2 overflow-hidden rounded-full h-11 w-11 cursor-pointer flex items-center justify-center bg-white">
            <img src="/images/performance-png.png" alt="User" className="h-11 w-11 object-cover" />
          </span>
        </Link>

      </button>
    </div>
  );
}
