import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching one user based on ID
    const fetchedUsers: User[] = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ];

    const foundUser = fetchedUsers.find((u) => u.id === Number(id));
    setUser(foundUser || null);
  }, [id]);

  if (!user) {
    return (
      <div className="p-4 bg-white shadow rounded-md">
        <p className="text-red-600">User not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-md space-y-4">
      <h2 className="text-2xl font-bold">User Detail</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to Users
      </button>
    </div>
  );
};

export default UserDetail;
