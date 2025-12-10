import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
  e.preventDefault();
  if (password && password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const updateData = {
      _id: userInfo._id,
      username,
      email,
      ...(password && { password }), // only include password if provided
    };

    const res = await updateProfile(updateData).unwrap();
    dispatch(setCredentials({ ...res }));
    toast.success("Profile updated successfully");
  } catch (err) {
    toast.error(err?.data?.message || err.error);
  }
};


  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Update Profile
        </h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="form-input w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-500"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="form-input w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="form-input w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              className="form-input w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loadingUpdateProfile}
              className={`${
                loadingUpdateProfile
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white py-3 px-6 rounded-lg font-medium shadow-lg transition duration-300`}
            >
              {loadingUpdateProfile ? "Updating..." : "Update"}
            </button>

            <Link
              to="/user-orders"
              className="bg-gray-100 text-purple-600 py-3 px-6 rounded-lg font-medium shadow-lg hover:bg-gray-200 transition duration-300"
            >
              My Orders
            </Link>
          </div>

          {loadingUpdateProfile && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default Profile;
