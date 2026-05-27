import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#7c3aed", "#22c55e", "#f97316", "#ef4444"];

export const PriorityChart = ({ data = [] }) => {
  const chartData = data.length ? data : [{ _id: "No data", value: 1 }];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md h-72">
      <h3 className="font-semibold mb-4">Priority Mix</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="_id" outerRadius={80}>
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
