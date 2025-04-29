import { downloadCSV } from "../utils/csvUtils";

export default function TestDataPreview({ data }) {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Generated Test Data</h3>
        <button
          onClick={() => downloadCSV(data)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          📥 Download CSV
        </button>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(data[0]).map((key, idx) => (
                <th key={idx} className="px-6 py-3">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {Object.values(row).map((val, i) => (
                  <td key={i} className="px-6 py-4">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
