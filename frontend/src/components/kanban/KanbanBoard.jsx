import { DndContext, closestCorners } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { updateTask } from "../../features/tasks/taskSlice";

const columns = ["todo", "in-progress", "completed"];

export const KanbanBoard = ({ tasks }) => {
  const dispatch = useDispatch();

  const onDragEnd = ({ active, over }) => {
    if (!over) return;
    const status = over.id;
    dispatch(updateTask({ id: active.id, payload: { status } }));
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((status) => (
          <div key={status} id={status} className="bg-white dark:bg-slate-900 rounded-2xl p-4 min-h-80">
            <h4 className="capitalize font-semibold mb-3">{status}</h4>
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div key={task._id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.priority}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
};
