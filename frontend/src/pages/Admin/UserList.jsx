import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { useEffect, useState } from "react";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <div className="text-3xl font-bold mb-6 text-gray-800 text-center">
        User Management
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <table className="w-full md:w-4/5 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left">NAME</th>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">EMAIL</th>
                <th className="px-6 py-4 text-center">ADMIN</th>
                <th className="px-6 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } border-b border-gray-300 hover:bg-gray-200 transition duration-200`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {editableUserId === user._id ? (
                      <input
                        type="text"
                        value={editableUserName}
                        onChange={(e) => setEditableUserName(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="px-6 py-4 break-words text-gray-600">
                    {user._id}
                  </td>
                  <td className="px-6 py-4">
                    {editableUserId === user._id ? (
                      <input
                        type="email"
                        value={editableUserEmail}
                        onChange={(e) => setEditableUserEmail(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                      />
                    ) : (
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {user.email}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.isAdmin ? (
                      <span className="bg-green-500 text-white py-1 px-3 rounded-full">
                        Admin
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white py-1 px-3 rounded-full">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      {editableUserId === user._id ? (
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {/* Placeholder for delete button for Admins */}
                      <button
                        className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg ${
                          user.isAdmin ? "invisible" : ""
                        }`}
                        onClick={() => !user.isAdmin && deleteHandler(user._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
