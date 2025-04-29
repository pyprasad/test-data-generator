export function downloadCSV(data, filename = "test_data.csv") {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // Header row
    ...data.map(row => headers.map(field => JSON.stringify(row[field], replacer)).join(","))
  ];

  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
  window.URL.revokeObjectURL(url);
}

function replacer(key, value) {
  return value === null ? "" : value;
}
