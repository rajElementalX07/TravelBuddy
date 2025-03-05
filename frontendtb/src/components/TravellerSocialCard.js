import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";
import { useSelector } from "react-redux";
import { FaWhatsapp, FaInstagram, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

const TravellerSocialCard = () => {
  const { id } = useParams();
  const {token} = useSelector((state) => state.user);
  const [traveller, setTraveller] = useState(null);

  useEffect(() => {
    const fetchTraveller = async () => {
      try {
        const response = await api.get(`/api/traveller/${id}`,{
            headers: {
                Authorization: `${token}`,
              },
        });
        console.log(response);
        setTraveller(response.data.traveller);
      } catch (error) {
        console.error("Error fetching traveller details:", error);
      }
    };

    fetchTraveller();
  }, [id]);

  if (!traveller) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen  p-5">
      <div className="card w-96 bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">
            {traveller.role === "traveller" ? "Traveller Card" : "User Card"}
          </h1>
          <h2 className="text-xl font-bold">Name : {traveller.firstname} {traveller.lastname}</h2>
          <p className="text-sm">Email : {traveller.email}</p>
        </div>

        <div className="p-6">
          <p className="text-gray-700"><strong>📞 Mobile:</strong> {traveller.mobile}</p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">🔗 Social Links</h3>
            <div className="mt-2 space-y-2">
              {traveller.socialLinks?.whatsapp && (
                <a href={`${traveller.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-800 text-lg">
                  <span>Visit WhatsApp</span>
                  <FaWhatsapp />
                </a>
              )}
              {traveller.socialLinks?.instagram && (
                <a href={`${traveller.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-500 hover:text-pink-700 text-lg">
                  <span>Visit Instagram</span>
                  <FaInstagram />
                </a>
              )}
              {traveller.socialLinks?.linkedin && (
                <a href={`${traveller.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 text-lg">
                  <span>Visit LinkedIn</span>
                  <FaLinkedin />
                </a>
              )}
              {traveller.socialLinks?.twitter && (
                <a href={`${traveller.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-lg">
                  <span>Visit Twitter</span>
                  <FaTwitter />
                </a>
              )}
              {traveller.socialLinks?.facebook && (
                <a href={`${traveller.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-lg">
                  <span>Visit Facebook</span>
                  <FaFacebook />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravellerSocialCard;
