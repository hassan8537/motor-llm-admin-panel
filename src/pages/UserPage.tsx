import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

interface User {
  UserId: string;
  Email: string;
  FirstName?: string;
  LastName?: string;
  Role: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  SessionToken?: string;
  SessionExpiry?: string;
  LastLogin?: string;
  EntityType: string;
  PK: string;
  SK: string;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserData>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createForm, setCreateForm] = useState<CreateUserData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user",
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
  });

  const navigate = useNavigate();

  // Show success message with auto-dismiss
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setTimeout(() => setSuccessMessage(""), 300); // Wait for animation
    }, 4000);
  };

  // Clear all messages
  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
    setShowToast(false);
  };

  // API utilities
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const baseUrl = BASE_URL;
    const version = "v1";

    const response = await fetch(`${baseUrl}/api/${version}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return response.json();
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      clearMessages();

      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.role && { role: filters.role }),
        ...(filters.isActive && { isActive: filters.isActive }),
      });

      const response = await apiCall(`/users?${queryParams}`);

      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      clearMessages();

      const response = await apiCall("/users", {
        method: "POST",
        body: JSON.stringify(createForm),
      });

      if (response.success) {
        setShowCreateForm(false);
        const userEmail = createForm.email;
        setCreateForm({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "user",
        });
        showSuccess(`User "${userEmail}" has been created successfully!`);
        await fetchUsers();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async (userId: string) => {
    try {
      setLoading(true);
      clearMessages();

      const response = await apiCall(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });

      if (response.success) {
        const userName =
          editForm.firstName && editForm.lastName
            ? `${editForm.firstName} ${editForm.lastName}`
            : editForm.email;
        showSuccess(`User "${userName}" has been updated successfully!`);
        setEditUserId(null);
        setEditForm({});
        await fetchUsers();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.UserId === userId);
    const userName =
      user?.FirstName && user?.LastName
        ? `${user.FirstName} ${user.LastName}`
        : user?.Email || "this user";

    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      setLoading(true);
      clearMessages();

      const response = await apiCall(`/users/${userId}`, {
        method: "DELETE",
      });

      if (response.success) {
        showSuccess(`User "${userName}" has been deleted successfully!`);
        await fetchUsers();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Toggle user active status
  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    const user = users.find(u => u.UserId === userId);
    const userName =
      user?.FirstName && user?.LastName
        ? `${user.FirstName} ${user.LastName}`
        : user?.Email || "User";

    try {
      setLoading(true);
      clearMessages();

      const response = await apiCall(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.success) {
        const action = !currentStatus ? "activated" : "deactivated";
        showSuccess(`${userName} has been ${action} successfully!`);
        await fetchUsers();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditUserId(user.UserId);
    setEditForm({
      firstName: user.FirstName || "",
      lastName: user.LastName || "",
      email: user.Email,
      role: user.Role,
      isActive: user.IsActive,
    });
  };

  const handleDetail = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Load users on component mount and when pagination/filters change
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isSessionActive = (sessionExpiry: string) => {
    if (!sessionExpiry) return false;
    return new Date(sessionExpiry) > new Date();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="p-4 space-y-4 bg-white shadow rounded-md">
      {/* Toast Notification */}
      {successMessage && (
        <div
          className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
            showToast
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center min-w-[300px]">
            <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="flex-1">{successMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-3 text-green-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Users Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          Create User
        </button>
      </div>

      {/* Inline Success Message */}
      {successMessage && !showToast && (
        <div className="p-3 text-sm text-green-600 bg-green-100 border border-green-300 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {successMessage}
          </div>
          <button
            onClick={() => setSuccessMessage("")}
            className="ml-2 text-green-800 hover:text-green-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-800 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-md">
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={filters.role}
            onChange={e =>
              setFilters(prev => ({ ...prev, role: e.target.value }))
            }
            className="border rounded px-3 py-1"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={filters.isActive}
            onChange={e =>
              setFilters(prev => ({ ...prev, isActive: e.target.value }))
            }
            className="border rounded px-3 py-1"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Desktop Users Table */}
      <div className="hidden sm:block overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
        <table className="w-full min-w-[800px] bg-white">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Created At
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && users.length === 0 ? (
              // Skeleton Loading Rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-3 py-4">
                    <div className="flex items-center">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </td>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center gap-2">
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                      <div className="h-6 bg-gray-200 rounded w-14"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Get started by creating a new user
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map(user =>
                editUserId === user.UserId ? (
                  <tr key={user.UserId} className="bg-gray-50">
                    <td className="p-2">
                      <div className="flex gap-1">
                        <input
                          value={editForm.firstName || ""}
                          onChange={e =>
                            setEditForm(prev => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          placeholder="First Name"
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                        <input
                          value={editForm.lastName || ""}
                          onChange={e =>
                            setEditForm(prev => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          placeholder="Last Name"
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      <input
                        value={editForm.email || ""}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1 w-full text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={editForm.role || ""}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1 w-full text-sm"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={editForm.isActive?.toString() || ""}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            isActive: e.target.value === "true",
                          }))
                        }
                        className="border rounded px-2 py-1 w-full text-sm"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </td>
                    <td className="p-2 text-sm text-gray-600 hidden md:table-cell">
                      {formatDateShort(user.CreatedAt)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
                        <button
                          onClick={() => handleUpdateUser(user.UserId)}
                          disabled={loading}
                          className="w-full sm:w-auto bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditUserId(null)}
                          className="w-full sm:w-auto bg-gray-400 text-white px-3 py-1 rounded text-xs hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={user.UserId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {user.FirstName || user.LastName
                          ? `${user.FirstName || ""} ${
                              user.LastName || ""
                            }`.trim()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-900 break-all">
                        {user.Email}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.Role
                        )}`}
                      >
                        {user.Role}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.IsActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.IsActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {formatDate(user.CreatedAt)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1 justify-center items-center">
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleToggleActive(user.UserId, user.IsActive)
                          }
                          disabled={loading}
                          className={`px-2 py-1 rounded text-xs text-white disabled:bg-gray-400 transition-colors ${
                            user.IsActive
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {user.IsActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.UserId)}
                          disabled={loading}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:bg-gray-400 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleDetail(user)}
                          className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile-only: Show a card view for better mobile experience */}
      <div className="block sm:hidden mt-4">
        <div className="text-sm text-gray-600 mb-2">
          Mobile View - {users.length} user{users.length !== 1 ? "s" : ""}
        </div>
        <div className="space-y-3">
          {loading && users.length === 0 ? (
            // Mobile Skeleton Loading
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mb-3 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            users.map(user => (
              <div
                key={user.UserId}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user.FirstName || user.LastName
                        ? `${user.FirstName || ""} ${
                            user.LastName || ""
                          }`.trim()
                        : "N/A"}
                    </h3>
                    <p className="text-sm text-gray-600 break-all">
                      {user.Email}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        user.Role
                      )}`}
                    >
                      {user.Role}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.IsActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.IsActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Created: {formatDateShort(user.CreatedAt)}
                  {user.LastLogin && (
                    <span className="ml-2">
                      • Last Login: {formatDateShort(user.LastLogin)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleToggleActive(user.UserId, user.IsActive)
                    }
                    disabled={loading}
                    className={`flex-1 px-3 py-2 rounded text-sm text-white disabled:bg-gray-400 ${
                      user.IsActive
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {user.IsActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDetail(user)}
                    className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.UserId)}
                    disabled={loading}
                    className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className="px-3 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-500 text-white rounded">
              {pagination.page}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
              className="px-3 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ background: "#00000085" }}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">User Details</h3>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedUser.UserId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.FirstName || selectedUser.LastName
                      ? `${selectedUser.FirstName || ""} ${
                          selectedUser.LastName || ""
                        }`.trim()
                      : "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{selectedUser.Email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(
                      selectedUser.Role
                    )}`}
                  >
                    {selectedUser.Role}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedUser.IsActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser.IsActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created At
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedUser.CreatedAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedUser.UpdatedAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Login
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedUser.LastLogin || "")}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Session Status
                  </label>
                  {selectedUser.SessionToken ? (
                    <div className="space-y-1">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          isSessionActive(selectedUser.SessionExpiry || "")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isSessionActive(selectedUser.SessionExpiry || "")
                          ? "Session Active"
                          : "Session Expired"}
                      </span>
                      <p className="text-xs text-gray-600">
                        Expires: {formatDate(selectedUser.SessionExpiry || "")}
                      </p>
                    </div>
                  ) : (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      No Active Session
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Database Keys
                  </label>
                  <p className="text-xs text-gray-600 font-mono">
                    PK: {selectedUser.PK}
                  </p>
                  <p className="text-xs text-gray-600 font-mono">
                    SK: {selectedUser.SK}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => navigate(`/users/${selectedUser.UserId}/files`)}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
              >
                View Files
              </button>
              <button
                onClick={() => {
                  setShowUserDetails(false);
                  handleEdit(selectedUser);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit User
              </button>
              <button
                onClick={() => setShowUserDetails(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={createForm.email}
                onChange={e =>
                  setCreateForm(prev => ({ ...prev, email: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={createForm.password}
                onChange={e =>
                  setCreateForm(prev => ({ ...prev, password: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="First Name"
                value={createForm.firstName}
                onChange={e =>
                  setCreateForm(prev => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={createForm.lastName}
                onChange={e =>
                  setCreateForm(prev => ({ ...prev, lastName: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
              />
              <select
                value={createForm.role}
                onChange={e =>
                  setCreateForm(prev => ({ ...prev, role: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
