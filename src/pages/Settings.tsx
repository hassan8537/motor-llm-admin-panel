
const AccountPreferencesSidebar = () => {
  return (
    <div className="w-86 p-4 bg-white">

      <nav className="space-y-1">
        <div className="flex items-center py-2 px-3 rounded-md space-x-2">
          <img className="w-6 h-6" src="./images/key-hole-icon.png" alt="" />
          <span className="text-[16px] font-medium">
            Account preferences</span>
        </div>
        <div className="flex items-center py-2 px-3 rounded-md space-x-2">
          <img className="w-5 h-5" src="./images/notification-icon.png" alt="" />
          <span className="text-[16px] font-medium">
            Notification</span>
        </div>

        <div className="flex items-center py-2 px-3 rounded-md space-x-2">
          <img className="w-6 h-6" src="./images/privacy-icon.png" alt="" />
          <span className="text-[16px]">Privacy</span>
        </div>

        <div className="flex items-center py-2 px-3 rounded-md space-x-2">
          <img className="w-6 h-6" src="./images/password-icon.png" alt="" />
          <span className="text-[16px]">
            Two-Step Authentication</span>
        </div>
      </nav>
    </div>
  );
};

export default AccountPreferencesSidebar