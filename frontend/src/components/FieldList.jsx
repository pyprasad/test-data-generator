import { useState } from "react";
import FieldCard from "./FieldCard";
import api from "../services/api";
import { saveTemplate, getAllTemplates, deleteTemplate } from "../utils/templates";

export default function FieldList({ fields, setFields, setGeneratedData }) {
    const [strategy, setStrategy] = useState("Positive");
    const [loading, setLoading] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [schemaText, setSchemaText] = useState("");
    const [generatedJson, setGeneratedJson] = useState("");

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
        const constraints = fields.map(f => f.constraints || {});

        setLoading(true);
        try {
            const res = await api.generateTestData(fieldNames, fieldTypes, constraints, strategy);
            if (res.status !== 200) {
                throw new Error("Failed to generate data");
            }
            setGeneratedData(res.data.data); // Use res.data.data to match backend response
        } catch (err) {
            console.error(err);
            alert("Failed to generate data.");
        } finally {
            setLoading(false);
        }
    };

    function extractFieldsFromJson(json) {
        const sample = Array.isArray(json) ? json[0] : json;

        return Object.entries(sample).map(([key, value]) => {
            let inferredType = typeof value;

            if (typeof value === "string") {
                if (key.toLowerCase().includes("email")) inferredType = "email";
                else if (key.toLowerCase().includes("date")) inferredType = "date";
                else if (/\d{4}-\d{2}-\d{2}/.test(value)) inferredType = "date";
            }

            return {
                name: key,
                type:
                    inferredType === "string" ? "text" :
                        inferredType === "boolean" ? "boolean" :
                            inferredType === "number" ? "number" :
                                inferredType === "email" ? "email" :
                                    inferredType === "date" ? "date" :
                                        "text",
                constraints: {}
            };
        });
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const json = JSON.parse(text);
            const newFields = extractFieldsFromJson(json);
            setFields(newFields);
            alert("✅ Fields imported from JSON successfully!");
        } catch (err) {
            console.error("Invalid JSON file:", err);
            alert("❌ Failed to parse JSON file.");
        }
    };

    const generateJsonFromSchema = async () => {
  if (!schemaText.trim()) return alert("Paste a valid JSON schema first!");

  try {
    const parsed = JSON.parse(schemaText);

    const prompt = `
You are a test data generator.

Given the following JSON structure or example schema:
${JSON.stringify(parsed, null, 2)}

Generate 5 rows of test data matching the same structure. 
Return JSON array only — no markdown, no explanation.
    `;

    const res = await api.generateJsonFromSchema(prompt);
    const content = res.data.data;
    let cleaned;
    if (typeof content === "string") {
      cleaned = content.replace(/```json|```/g, "").trim();
    } else {
      cleaned = JSON.stringify(content, null, 2);
    }
    setGeneratedJson(cleaned);
  } catch (err) {
    console.error(err);
    alert("Invalid JSON or failed to generate data.");
  }
};

const downloadJson = () => {
  const blob = new Blob([generatedJson], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "test_data.json";
  a.click();
  window.URL.revokeObjectURL(url);
};


    return (
        <div id="fields" className="space-y-8">
            {/* Header Row */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Define Your Fields</h2>
                <button onClick={addField} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    + Add Field
                </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                <label className="text-sm font-medium text-gray-600">
                    Import from JSON:
                    <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileUpload}
                        className="ml-2 p-2 border rounded"
                    />
                </label>
            </div>

            {/* Template Controls */}
            <div className="flex flex-wrap items-center gap-2">
                <input
                    type="text"
                    placeholder="Template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="p-2 border rounded"
                />
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                        if (templateName && fields.length > 0) {
                            saveTemplate(templateName, fields);
                            alert("Template saved!");
                        }
                    }}
                >
                    💾 Save Template
                </button>
                <select
                    value={selectedTemplate}
                    onChange={(e) => {
                        const chosen = e.target.value;
                        setSelectedTemplate(chosen);
                        if (chosen) setFields(getAllTemplates()[chosen] || []);
                    }}
                    className="p-2 border rounded"
                >
                    <option value="">📂 Load Template</option>
                    {Object.keys(getAllTemplates()).map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                <button
                    className="text-red-600 text-sm hover:underline"
                    onClick={() => {
                        if (selectedTemplate) {
                            deleteTemplate(selectedTemplate);
                            setSelectedTemplate("");
                            alert("Template deleted.");
                        }
                    }}
                >
                    🗑 Delete
                </button>
            </div>

            {/* Field Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                    <FieldCard key={index} field={field} onChange={(updated) => updateField(index, updated)} />
                ))}
            </div>

            {/* Generate Button */}
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
                    className={`px-6 py-2 rounded text-white flex items-center justify-center gap-2 transition min-w-[220px] ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-pink-500 hover:bg-pink-600"
                        }`}
                >
                    {loading && (
                        <span className="spinner" aria-label="Loading"></span>
                    )}
                    <span>{loading ? "Generating..." : "🚀 Generate Test Data"}</span>
                </button>
            </div>

            <hr className="my-10" />
            <h3 className="text-xl font-semibold">🔬 Advanced JSON Mode</h3>

            <textarea
                value={schemaText}
                onChange={(e) => setSchemaText(e.target.value)}
                placeholder="Paste JSON object or schema here..."
                className="w-full h-40 border p-2 rounded bg-white"
            ></textarea>

            <button
                onClick={generateJsonFromSchema}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                🧠 Generate Test Data
            </button>

            {generatedJson && (
                <>
                    <h4 className="mt-6 font-semibold">📄 Generated JSON</h4>
                    <textarea
                        value={generatedJson}
                        readOnly
                        className="w-full h-40 border p-2 mt-2 bg-gray-100 font-mono"
                    ></textarea>
                    <button
                        onClick={downloadJson}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        💾 Download JSON
                    </button>
                </>
            )}

        </div>

    );

}
