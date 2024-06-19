import React, { useEffect, useState } from "react";

const Data = () => {
  const [storedQaData, setStoredQaData] = useState([]);

  useEffect(() => {
    // Retrieve the stored qaData from local storage
    const data = localStorage.getItem("qaData");
    if (data) {
      setStoredQaData(JSON.parse(data));
    }
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "left" }}>
      {storedQaData.map((qa, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>User:</span>
            <span style={{ marginLeft: "10px" }}>{qa.question}</span>
          </div>
          {qa.answer && (
            <div>
              <span style={{ fontWeight: "bold" }}>Bot:</span>
              <span style={{ marginLeft: "10px" }}>{qa.answer}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Data;
