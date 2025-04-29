import HeroSection from "../components/HeroSection";
import FieldList from "../components/FieldList";
import TestDataPreview from "../components/TestDataPreview";
import { useState } from "react";

export default function Home() {
  const [fields, setFields] = useState([]);
  const [generatedData, setGeneratedData] = useState([]);

  return (
    <div>
      <HeroSection />
      <div className="max-w-6xl mx-auto p-6">
        <FieldList fields={fields} setFields={setFields} setGeneratedData={setGeneratedData} />
        {generatedData.length > 0 && (
          <TestDataPreview data={generatedData} />
        )}
      </div>
    </div>
  );
}
