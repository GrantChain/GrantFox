"use client";

import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { useKanbanParams } from "@/hooks/useKanbanParams";
import { DndContext } from "@dnd-kit/core";

export default function App() {
  const { COLUMNS, tasks, handleDragEnd } = useKanbanParams();

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex gap-4 min-w-max w-full">
          <DndContext onDragEnd={handleDragEnd}>
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
}
