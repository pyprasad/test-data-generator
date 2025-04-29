import { motion } from "framer-motion";

export default function FieldCard({ field, onChange }) {
  const updateName = (e) => {
    onChange({ ...field, name: e.target.value });
  };

  const updateType = (e) => {
    onChange({ ...field, type: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-lg p-4 shadow-sm bg-white"
    >
      <input
        type="text"
        placeholder="Field Name"
        value={field.name}
        onChange={updateName}
        className="w-full p-2 border-b mb-2 outline-none"
      />
      <select value={field.type} onChange={updateType} className="w-full p-2 border rounded">
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="number">Number</option>
        <option value="phone">Phone</option>
        <option value="date">Date</option>
        <option value="boolean">Boolean</option>
      </select>
    </motion.div>
  );
}
