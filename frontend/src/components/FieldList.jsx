import { useState } from "react";
import FieldCard from "./FieldCard";
import api from "../services/api";

export default function FieldList({ fields, setFields, setGeneratedData }) {
  const [strategy, setStrategy] = useState("Positive");
  const [loading, setLoading] = useState(false);

  const addField = () => {
    setFields([...fields, { name: "", type: "text" }]);
  };

  const updateField = (index, updatedField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const isValid = () => {
    return fields.length > 0 && fields.every(f => f.name.trim() !== "" && f.type.trim() !== "");
  };

  const generateData = async () => {
    if (!isValid()) return;

    const fieldNames = fields.map(f => f.name);
    const fieldTypes = fields.map(f => f.type);

    setLoading(true);
    try {
      const res = await api.generateTestData(fieldNames, fieldTypes, strategy);
      setGeneratedData(res.data.data); // Use res.data.data to match backend response
    } catch (err) {
      console.error(err);
      alert("Failed to generate data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="fields" className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Define Your Fields</h2>
        <button onClick={addField} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          + Add Field
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <FieldCard key={index} field={field} onChange={(updated) => updateField(index, updated)} />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="p-2 border rounded"
        >
          <option>Positive</option>
          <option>Negative</option>
          <option>Edge Case</option>
          <option>Positive, Negative & Edge</option>
        </select>

        <button
          onClick={generateData}
          disabled={!isValid() || loading}
          className={`px-6 py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {loading ? "Generating..." : "🚀 Generate Test Data"}
        </button>
      </div>
    </div>
  );
}
