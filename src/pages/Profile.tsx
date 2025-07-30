import { useState, useEffect } from "react";
import BASE_URL from "../config";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { useModal } from "../hooks/useModal";

const baseUrl = BASE_URL;
const version = "/api/v1";

// Type definitions based on actual API response
interface UserData {
  UserId: string;
  Role: string;
  SK: string;
  PK: string;
  CreatedAt: string;
  Email: string;
}

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: UserData;
}

interface FormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfilePageProps {
  userId: string;
}

const ProfilePage = ({ userId }: ProfilePageProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>(
    "./images/performance-png.png"
  );
  const [formData, setFormData] = useState<FormData>({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}${version}/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          setUserData(result.data);

          // Initialize form data with API data
          setFormData({
            email: result.data.Email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          throw new Error(result.message || "Failed to fetch user data");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    // Check if passwords match
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords do not match");
      return false;
    }

    // Check if new password is provided but current password is not
    if (formData.newPassword && !formData.currentPassword) {
      setError("Current password is required to set a new password");
      return false;
    }

    // Check password strength (optional)
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);
      setError(null);

      // Validate form
      if (!validateForm()) {
        setSaving(false);
        return;
      }

      // Prepare update payload
      const updatePayload: any = {
        Email: formData.email,
      };

      // Only include password field if user is changing password
      if (formData.newPassword) {
        updatePayload.Password = formData.newPassword;
        // Note: CurrentPassword validation should be handled by the backend
      }

      const token = localStorage.getItem("authToken");
      const response = await fetch(`${baseUrl}${version}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        // Update local state with new data
        setUserData(result.data);

        // Reset password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        console.log("Changes saved successfully!");
        closeModal();
      } else {
        throw new Error(result.message || "Failed to save changes");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error saving changes:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = (): void => {
    if (!saving) {
      // Reset form when closing modal
      setFormData(prev => ({
        email: userData?.Email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setError(null);
      closeModal();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserDisplayName = () => {
    if (!userData) return "Loading...";
    // Extract username from email or use email
    const emailUsername = userData.Email?.split("@")[0] || "User";
    return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
  };

  if (loading) {
    return (
      <div className="bg-white p-4 font-sans flex">
        <div className="w-1/4 pr-4">
          <div className="flex flex-col items-center">
            <button className="text-sm font-medium text-blue-600 border border-gray-300 rounded-lg p-4 px-4 w-[10rem] hover:text-blue-800 px-3 py-1">
              PROFILE
            </button>
            <div className="relative w-24 h-24 mb-3 my-6">
              <div className="w-full h-full rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex flex-col space-y-2 items-center">
              <div className="w-[10rem] h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="w-3/4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="space-y-1">
                  {[...Array(2)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !isOpen) {
    return (
      <div className="bg-white p-4 font-sans">
        <div className="border border-red-200 rounded-lg bg-red-50 p-4">
          <p className="text-red-600">Error loading profile: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 font-sans flex">
      {/* Left Column - Profile Photo and Buttons */}
      <div className="w-1/4 pr-4">
        <div className="flex flex-col items-center">
          <button className="text-sm font-medium text-blue-600 border border-gray-300 rounded-lg p-4 px-4 w-[10rem] hover:text-blue-800 px-3 py-1">
            PROFILE
          </button>

          {/* Profile Image */}
          <div className="relative w-24 h-24 mb-3 my-6">
            <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src = "./images/performance-png.png";
                }}
              />
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex flex-col space-y-2 items-center">
            <button
              onClick={openModal}
              className="text-sm font-medium text-blue-600 border border-gray-300 rounded-lg px-4 p-4 w-[10rem] hover:text-blue-800 px-3 py-1"
            >
              EDIT
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Profile Information */}
      <div className="w-3/4">
        <h1 className="text-xl font-bold mb-2">{getUserDisplayName()}</h1>
        <p className="text-gray-600 mb-4">User ID: {userData?.UserId}</p>

        {/* Contact Information */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Contact Information</h2>
          <div className="space-y-1 text-sm">
            <p>Email: {userData?.Email || "Not provided"}</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Account Information</h2>
          <div className="space-y-1 text-sm">
            <p>Role: {userData?.Role || "Not provided"}</p>
          </div>
        </div>

        {/* System Information */}
        <div>
          <h2 className="font-semibold mb-2">System Information</h2>
          <div className="space-y-1 text-sm">
            <p>Created: {formatDate(userData?.CreatedAt || "")}</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        className="max-w-[600px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Account Settings
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your email address and password.
            </p>
          </div>

          {error && (
            <div className="mx-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form className="flex flex-col" onSubmit={e => e.preventDefault()}>
            <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 pb-3">
              <div className="space-y-6">
                {/* Email Section */}
                <div>
                  <h5 className="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">
                    Email Address
                  </h5>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={e => handleInputChange("email", e.target.value)}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Password Section */}
                <div>
                  <h5 className="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">
                    Change Password
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        value={formData.currentPassword}
                        onChange={e =>
                          handleInputChange("currentPassword", e.target.value)
                        }
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password (min. 6 characters)"
                        value={formData.newPassword}
                        onChange={e =>
                          handleInputChange("newPassword", e.target.value)
                        }
                        disabled={saving}
                        minLength={6}
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={e =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        disabled={saving}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Leave password fields empty if you don't want to change your
                    password.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleModalClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
