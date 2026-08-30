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

        {/* Contacts List */}

        {contacts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#160a24]/70 p-8 text-center backdrop-blur-xl">
            <p className="text-gray-400">No contacts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#160a24]/70 p-5 sm:p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.30)] transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)]"
              >
                {/* Glow */}
                <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                  {/* Contact Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-pink-400 mb-1">
                        Emergency Contact
                      </p>

                      <h2 className="text-xl font-semibold text-white">
                        {contact.name}
                      </h2>
                    </div>

                    {/* Contact Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400 text-[#0a0512] font-bold shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                      {contact.name
                        ? contact.name.charAt(0).toUpperCase()
                        : "C"}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>

                    <p className="text-gray-200">📞 {contact.phone}</p>
                  </div>

                  {/* Relation */}
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-gray-500 mb-1">Relation</p>

                    <p className="text-cyan-300 font-medium">
                      👤 {contact.relation}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(contact)}
                      className="flex-1 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 font-semibold text-cyan-300 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)] active:scale-[0.98]"
                    >
                      ✏️ Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="flex-1 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(248,113,113,0.08)] active:scale-[0.98]"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contacts;
