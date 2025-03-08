/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from "react";
import { Button } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const DonutChart = () => {
  const data = [
    { name: "New", value: 900 },
    { name: "Returning", value: 100 },
  ];
  const COLORS = ["#36A2EB", "#FF6384"]; // Colors for the segments

  return (
    <PieChart width={500} height={300} style={{border:"2px solid black"}}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={100}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
        label={(entry) => `${entry.name}: ${entry.value}%`} // Show labels
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};


const PerformanceReport = ({ candidateID, onBack }) => {
  return (
    <div>
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: "20px" }}>
        Back
      </Button>
      <div>Performance Report for Candidate ID: {candidateID}</div>
      <div>
        <DonutChart />
      </div>
    </div>
  );
};

export default PerformanceReport;
