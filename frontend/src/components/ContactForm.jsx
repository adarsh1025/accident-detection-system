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
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-[#160a24]/70 p-5 sm:p-6 md:p-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      {/* Pink Glow */}
      <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

      {/* Cyan Glow */}
      <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        {/* Contact Name */}
        <input
          type="text"
          name="name"
          placeholder="Contact Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white placeholder-gray-500 outline-none transition-all duration-300 hover:border-white/20 focus:border-pink-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-pink-500/10"
          required
        />

        {/* Phone Number */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white placeholder-gray-500 outline-none transition-all duration-300 hover:border-white/20 focus:border-purple-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-purple-500/10"
          required
        />

        {/* Telegram Chat ID */}
        <input
          type="text"
          name="telegramChatId"
          placeholder="Telegram Chat ID"
          value={formData.telegramChatId}
          onChange={handleChange}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white placeholder-gray-500 outline-none transition-all duration-300 hover:border-white/20 focus:border-cyan-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-cyan-400/10"
        />

        {/* Relation */}
        <input
          type="text"
          name="relation"
          placeholder="Relation (Father, Brother...)"
          value={formData.relation}
          onChange={handleChange}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white placeholder-gray-500 outline-none transition-all duration-300 hover:border-white/20 focus:border-pink-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-pink-500/10"
          required
        />

        {/* Add / Update Button */}
        <button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 px-6 py-3 rounded-xl font-bold text-[#0a0512] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(236,72,153,0.20)] active:scale-[0.98]"
        >
          {isEditing ? "Update Contact" : "Add Contact"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
