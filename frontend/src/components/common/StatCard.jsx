import { motion } from "framer-motion";

export const StatCard = ({ title, value }) => (
  <motion.div whileHover={{ y: -3 }} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </motion.div>
);
