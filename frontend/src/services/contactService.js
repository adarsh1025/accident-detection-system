import axios from "axios";

const API_URL = "http://localhost:5000/api/contacts";
// const API_URL = "http://192.168.1.8:5000/api/contacts";

export const getContacts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 👇 Ye code getContacts() ke niche add karna hai

export const addContact = async (contactData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, contactData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteContact = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateContact = async (id, contactData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}`, contactData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
