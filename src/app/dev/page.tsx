'use client'

import { DndContext } from '@dnd-kit/core';
import { KanbanColumn } from '@/components/ui/kanban/KanbanColumn';
import { useKanbanParams } from '@/hooks/useKanbanParams';

export default function App() {
  const { COLUMNS, tasks, handleDragEnd } = useKanbanParams();

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => {
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}