import { useSelector } from "react-redux";
import { KanbanBoard } from "../components/kanban/KanbanBoard";

export const KanbanPage = () => {
  const tasks = useSelector((state) => state.tasks.items);
  return <KanbanBoard tasks={tasks} />;
};
