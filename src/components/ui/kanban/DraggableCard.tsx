import { Item } from '@/interfaces/kanban.interface';
import { useDraggable } from '@dnd-kit/core';

type TaskCardProps = {
  item: Item;
};

export function DraggableCard({ item }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
      style={style}
    >
      <h3 className="font-medium text-neutral-100">{item.title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{item.description}</p>
    </div>
  );
}