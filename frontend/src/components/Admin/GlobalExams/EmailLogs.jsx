/*eslint-disable no-unused-vars*/


import React, { useState, useEffect } from "react";
import Service from "../../../service/Service";
const EmailLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const res = Service.get("/api/email-logs");
    console.log(res);
    setLogs(res.data.logs || []);
    setLoading(false);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Email Logs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Recipient</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{log.recipient}</td>
                <td className={`border p-2 ${log.status === "delivered" ? "text-green-600" : "text-red-600"}`}>
                  {log.status}
                </td>
                <td className="border p-2">{log.reason || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmailLogs;
