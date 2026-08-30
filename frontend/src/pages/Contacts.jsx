import { useEffect, useState } from "react";
import {
  getContacts,
  addContact,
  deleteContact,
  updateContact,
} from "../services/contactService";
import ContactForm from "../components/ContactForm";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      if (isEditing) {
        await updateContact(editData._id, contactData);

        alert("Contact Updated Successfully");

        setIsEditing(false);
        setEditData(null);
      } else {
        await addContact(contactData);

        alert("Contact Added Successfully");
      }

      fetchContacts();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?",
    );

    if (!confirmDelete) return;

    try {
      await deleteContact(id);

      alert("Contact Deleted Successfully");

      fetchContacts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete contact");
    }
  };

  const handleEdit = (contact) => {
    setIsEditing(true);
    setEditData(contact);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#160a24] via-[#0f0719] to-[#0a0512] text-[#f1e9ff]">
      {/* Background Pink Glow */}
      <div className="fixed -top-40 left-[60%] -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-b from-pink-500/30 to-purple-500/10 blur-3xl pointer-events-none"></div>

      {/* Background Cyan Glow */}
      <div className="fixed bottom-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>

      {/* Cyber Grid Background */}
      <div
        className="
        fixed
        inset-x-0
        bottom-0
        h-[45vh]
        opacity-[0.07]
        pointer-events-none
        [background-image:linear-gradient(rgba(63,240,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(63,240,255,0.5)_1px,transparent_1px)]
        [background-size:55px_55px]
      "
      ></div>

      {/* Page Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-pink-400">
            Safety Network
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Emergency{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Contacts
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-400">
            Manage your emergency contacts
          </p>

          <div className="mt-4 h-[2px] w-28 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(236,72,153,0.5)]"></div>
        </div>
        <ContactForm
          onAdd={handleAddContact}
          editData={editData}
          isEditing={isEditing}
        />
        {contacts.length === 0 ? (
          <p>No contacts found.</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className="border rounded-lg p-4 mb-4 shadow"
            >
              <h2 className="text-lg font-semibold">{contact.name}</h2>

              <p>{contact.phone}</p>

              <p>{contact.relation}</p>
              <button
                onClick={() => handleEdit(contact)}
                className="mt-3 mr-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(contact._id)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Contacts;
