import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../config";

interface FileItem {
  FileId: string;
  FileName: string;
  FileSize: number;
  FileExtension: string;
  MimeType: string;
  PublicUrl: string;
  S3Bucket: string;
  S3Key: string;
  ProcessingStatus: string;
  ProcessingSuccessRate: number;
  SuccessfulChunks: number;
  TotalChunks: number;
  TextLength: number;
  TTL: number;
  Collection: string;
  CreatedAt: string;
  UpdatedAt: string;
  UserId: string;
  EntityType: string;
  PK: string;
  SK: string;
}

interface UserFilesProps {
  userId?: string; // Optional prop for specific user, otherwise uses current user
}

const UserFiles: React.FC<UserFilesProps> = ({ userId }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { userId: paramUserId } = useParams<{ userId: string }>();

  // Use prop userId, param userId, or current user's ID
  const targetUserId = userId || paramUserId;

  // Show success message with auto-dismiss
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setTimeout(() => setSuccessMessage(""), 300);
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

  // Fetch user files
  const fetchUserFiles = async () => {
    if (!targetUserId) {
      setError("User ID is required to fetch files");
      return;
    }

    try {
      setLoading(true);
      clearMessages();

      const response = await apiCall(`/users/${targetUserId}/files`);

      if (response.success) {
        console.log("Fetched files:", response.data);
        setFiles(response.data || []);
        if (response.data?.length === 0) {
          showSuccess("No files found for this user.");
        }
      }
    } catch (err: any) {
      console.error("Fetch files error:", err);
      setError(err.message || "Failed to fetch user files");
    } finally {
      setLoading(false);
    }
  };

  // Delete file (if needed)
  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      setLoading(true);
      clearMessages();

      // Assuming there's a delete endpoint
      const response = await apiCall(`/files/${fileId}`, {
        method: "DELETE",
      });

      if (response.success) {
        showSuccess("File deleted successfully!");
        await fetchUserFiles();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete file");
    } finally {
      setLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
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

  // Get file type icon
  const getFileIcon = (fileExtension: string, mimeType: string) => {
    const ext = fileExtension?.toLowerCase() || "";
    const mime = mimeType?.toLowerCase() || "";

    if (ext === "pdf" || mime.includes("pdf")) return "📄";
    if (mime.includes("image")) return "🖼️";
    if (mime.includes("video")) return "🎥";
    if (mime.includes("audio")) return "🎵";
    if (ext === "doc" || ext === "docx" || mime.includes("word")) return "📝";
    if (
      ext === "xls" ||
      ext === "xlsx" ||
      mime.includes("excel") ||
      mime.includes("sheet")
    )
      return "📊";
    if (
      ext === "ppt" ||
      ext === "pptx" ||
      mime.includes("powerpoint") ||
      mime.includes("presentation")
    )
      return "📽️";
    if (
      ext === "zip" ||
      ext === "rar" ||
      mime.includes("zip") ||
      mime.includes("rar")
    )
      return "🗜️";
    if (ext === "txt" || mime.includes("text")) return "📃";
    return "📁";
  };

  // Get processing status badge
  const getProcessingStatusBadge = (status: string, successRate: number) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
            ✅ Completed ({successRate}%)
          </span>
        );
      case "processing":
        return (
          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
            ⏳ Processing
          </span>
        );
      case "failed":
        return (
          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
            ❌ Failed
          </span>
        );
      default:
        return (
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  // Load files on component mount
  useEffect(() => {
    fetchUserFiles();
  }, [targetUserId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-300 max-w-6xl mx-auto">
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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User Files</h2>
        <button
          onClick={fetchUserFiles}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md flex items-center justify-between">
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

      {/* Files Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b">
              <th className="py-3 px-4 text-left">File</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Size</th>
              <th className="py-3 px-4 text-left">Processing</th>
              <th className="py-3 px-4 text-left">Chunks</th>
              <th className="py-3 px-4 text-left">Uploaded At</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && files.length === 0 ? (
              // Skeleton Loading Rows for Files
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="animate-pulse border-b">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : files.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No files uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Files will appear here once uploaded
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              files.map(file => (
                <tr key={file.FileId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {getFileIcon(file.FileExtension, file.MimeType)}
                      </span>
                      <div>
                        <div
                          className="font-medium text-gray-900 max-w-xs truncate"
                          title={file.FileName}
                        >
                          {file.FileName}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {file.FileId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        {file.FileExtension.toUpperCase()}
                      </span>
                      <div className="text-xs text-gray-500">
                        {file.MimeType}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {file.FileSize > 0 ? formatFileSize(file.FileSize) : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {getProcessingStatusBadge(
                        file.ProcessingStatus,
                        file.ProcessingSuccessRate
                      )}
                      <div className="text-xs text-gray-500">
                        Text: {file.TextLength.toLocaleString()} chars
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs">
                      <div className="text-gray-900">
                        {file.SuccessfulChunks}/{file.TotalChunks}
                      </div>
                      <div className="text-gray-500">chunks</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{formatDate(file.CreatedAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {file.PublicUrl ? (
                        <a
                          href={file.PublicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No URL</span>
                      )}
                      <button
                        onClick={() => handleDeleteFile(file.FileId)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm hover:underline disabled:text-gray-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* File Statistics */}
      {files.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Total Files:</span>
              <span className="ml-2 text-gray-900">{files.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Size:</span>
              <span className="ml-2 text-gray-900">
                {formatFileSize(
                  files.reduce((total, file) => total + file.FileSize, 0)
                )}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Text Extracted:</span>
              <span className="ml-2 text-gray-900">
                {files
                  .reduce((total, file) => total + file.TextLength, 0)
                  .toLocaleString()}{" "}
                chars
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Processing:</span>
              <span className="ml-2 text-gray-900">
                {files.filter(f => f.ProcessingStatus === "completed").length}/
                {files.length} completed
              </span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">User ID:</span>
            <span className="ml-2 font-mono">{targetUserId}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFiles;
