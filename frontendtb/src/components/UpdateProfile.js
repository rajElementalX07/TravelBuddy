import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { setUser } from "../features/userSlice";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);
  
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    socialLinks: {
      whatsapp: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      facebook: "",
    },
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        socialLinks: {
          whatsapp: user?.socialLinks?.whatsapp || "",
          instagram: user?.socialLinks?.instagram || "",
          twitter: user?.socialLinks?.twitter || "",
          linkedin: user?.socialLinks?.linkedin || "",
          facebook: user?.socialLinks?.facebook || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("socialLinks.")) {
      const socialField = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialField]: value },
      }));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // Submit the updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/update-profile", profile, {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        dispatch(setUser({ user: response.data.user, token }));
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-6">
      <div className="w-full max-w-3xl bg-base-100 shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                name="firstname"
                placeholder="Enter your first name"
                value={profile.firstname}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                name="lastname"
                placeholder="Enter your last name"
                value={profile.lastname}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={profile.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter your mobile number"
              value={profile.mobile}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter a new password (leave blank to keep the same)"
              value={profile.password}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <h3 className="text-xl font-semibold mt-4">Social Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">WhatsApp URL</label>
              <input
                type="text"
                name="socialLinks.whatsapp"
                placeholder="Enter WhatsApp number"
                value={profile.socialLinks.whatsapp}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">Instagram URL</label>
              <input
                type="text"
                name="socialLinks.instagram"
                placeholder="Enter Instagram URL"
                value={profile.socialLinks.instagram}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">Twitter URL</label>
              <input
                type="text"
                name="socialLinks.twitter"
                placeholder="Enter Twitter URL"
                value={profile.socialLinks.twitter}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">LinkedIn Profile</label>
              <input
                type="text"
                name="socialLinks.linkedin"
                placeholder="Enter LinkedIn URL"
                value={profile.socialLinks.linkedin}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">Facebook Profile</label>
              <input
                type="text"
                name="socialLinks.facebook"
                placeholder="Enter Facebook URL"
                value={profile.socialLinks.facebook}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
