import { useEffect, useState } from "react";

function ContactForm({ onAdd, editData, isEditing }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    telegramChatId: "",
    relation: "",
  });
  useEffect(() => {
    if (isEditing && editData) {
      setFormData({
        name: editData.name,
        phone: editData.phone,
        telegramChatId: editData.telegramChatId,
        relation: editData.relation,
      });
    }
  }, [isEditing, editData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd(formData);

    setFormData({
      name: "",
      phone: "",
      telegramChatId: "",
      relation: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        name="name"
        placeholder="Contact Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
        required
      />
      <input
        type="text"
        name="telegramChatId"
        placeholder="Telegram Chat ID"
        value={formData.telegramChatId}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-3"
      />

      <input
        type="text"
        name="relation"
        placeholder="Relation (Father, Brother...)"
        value={formData.relation}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-5 py-2 rounded"
      >
        {isEditing ? "Update Contact" : "Add Contact"}
      </button>
    </form>
  );
}

export default ContactForm;
