import { useState } from "react";
import { motion } from "framer-motion";

export default function FieldCard({ field, onChange }) {
  const [showConstraints, setShowConstraints] = useState(false);

  const updateName = (e) => onChange({ ...field, name: e.target.value });
  const updateType = (e) => onChange({ ...field, type: e.target.value, constraints: {} });

  const updateConstraint = (key, value) => {
    onChange({
      ...field,
      constraints: {
        ...field.constraints,
        [key]: value
      }
    });
  };

  const renderConstraints = () => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <div className="mt-2 space-y-2">
            <input
              type="number"
              placeholder="minLength"
              className="w-full p-2 border rounded"
              onChange={(e) => updateConstraint("minLength", e.target.value)}
            />
            <input
              type="number"
              placeholder="maxLength"
              className="w-full p-2 border rounded"
              onChange={(e) => updateConstraint("maxLength", e.target.value)}
            />
            <input
              type="text"
              placeholder="Required special characters (e.g. @#$%)"
              className="w-full p-2 border rounded"
              onChange={(e) => updateConstraint("specialChars", e.target.value)}
            />
          </div>
        );

      case "number":
        return (
          <div className="mt-2 space-y-2">
            <input type="number" placeholder="min"
              className="w-full p-2 border rounded"
              onChange={(e) => updateConstraint("min", e.target.value)} />
            <input type="number" placeholder="max"
              className="w-full p-2 border rounded"
              onChange={(e) => updateConstraint("max", e.target.value)} />
          </div>
        );
      case "date":
        return (
          <div className="mt-2 space-y-2">
            <input type="date" placeholder="from"
              className="w-full p-2 border rounded"
              onChange={(e) => updateConstraint("fromDate", e.target.value)} />
            <input type="date" placeholder="to"
              className="w-full p-2 border rounded"
              onChange={(e) => updateConstraint("toDate", e.target.value)} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="border rounded-lg p-4 shadow-sm bg-white">
      <input
        type="text"
        placeholder="Field Name"
        value={field.name}
        onChange={updateName}
        className="w-full p-2 border-b mb-2 outline-none"
      />
      <input
        type="text"
        placeholder="Special characters (e.g. @#$%)"
        className="w-full p-2 border rounded"
        onChange={(e) => updateConstraint("specialChars", e.target.value)}
      />

      <select value={field.type} onChange={updateType} className="w-full p-2 border rounded mb-2">
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="number">Number</option>
        <option value="phone">Phone</option>
        <option value="date">Date</option>
        <option value="boolean">Boolean</option>
      </select>

      <button
        type="button"
        onClick={() => setShowConstraints(!showConstraints)}
        className="text-sm text-indigo-600 hover:underline mb-2"
      >
        {showConstraints ? "Hide Constraints" : "Add Constraints"}
      </button>

      {showConstraints && renderConstraints()}
    </motion.div>
  );
}
