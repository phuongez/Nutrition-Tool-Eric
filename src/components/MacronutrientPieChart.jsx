import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const MacronutrientPieChart = ({ protein, carbs, fat }) => {
    const totalCalories = protein * 4 + carbs * 4 + fat * 9; // Tính tổng calo
    const data = [
        { name: "Protein", value: protein * 4 },
        { name: "Carbs", value: carbs * 4 },
        { name: "Fat", value: fat * 9 }
    ];
    
    const COLORS = ["#EE6658", "#444343", "#ebebeb"]; // Màu sắc cho từng thành phần

    return (
        <PieChart width={400} height={400}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default MacronutrientPieChart;
