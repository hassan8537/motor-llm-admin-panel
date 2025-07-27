
const ProfilePage = () => {
  return (
    <div className="bg-white p-4 font-sans flex">
      {/* Left Column - Profile Photo and Buttons */}
      <div className="w-1/4 pr-4">
      <div className="flex flex-col items-center">
      <button className="text-sm font-medium text-blue-600 border border-gray-300 rounded-lg p-4 px-4 w-[10rem] hover:text-blue-800 px-3 py-1">
      PROFILE
    </button>
  {/* Profile Image with Upload Indicator */}
  <div className="relative w-24 h-24 mb-3 my-6">
 
    <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
      {/* Replace with actual image when available */}
      <img 
        src="./images/performance-png.png" 
        alt="Profile"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '';
          e.currentTarget.alt = 'Initial';
        }}
      />
    </div>
  </div>

  {/* Buttons - Centered below image */}
  <div className="flex flex-col space-y-2 items-center">
    <button className="text-sm font-medium text-blue-600 border border-gray-300 rounded-lg p-4 px-4 w-[10rem] hover:text-blue-800 px-3 py-1">
      CHANGE
    </button>
    <button className="text-sm font-medium text-blue-600 border border-gray-300 rounded-lg px-4 p-4 w-[10rem] hover:text-blue-800 px-3 py-1">
      EDIT
    </button>
  </div>
</div>
      </div>

      {/* Right Column - Profile Information */}
      <div className="w-3/4">
        <h1 className="text-xl font-bold mb-2">Alex Vincent</h1>
        <p className="text-gray-600 mb-4">New York, NY</p>

        {/* Contact Information */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Contact Information</h2>
          <div className="space-y-1 text-sm">
            <p>Email: alexvincent@gmail.com</p>
            <p>Phone: +1 123 456 7890</p>
            <p>Address: S25 E 68th street</p>
            <p className="ml-8">New York, NY 10651-78 156-187-60</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Basic Information</h2>
          <div className="space-y-1 text-sm">
            <p>Gender: Male</p>
            <p>Date of Birth: 20 July, 1992</p>
          </div>
        </div>

        {/* Other Information */}
        <div>
          <h2 className="font-semibold mb-2">Other Information</h2>
          <div className="space-y-1 text-sm">
            <p>Joined: 2022-05-15</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;