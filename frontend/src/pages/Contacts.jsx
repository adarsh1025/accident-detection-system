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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Emergency Contacts</h1>
      <ContactForm
        onAdd={handleAddContact}
        editData={editData}
        isEditing={isEditing}
      />
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        contacts.map((contact) => (
          <div key={contact._id} className="border rounded-lg p-4 mb-4 shadow">
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
  );
}

export default Contacts;
