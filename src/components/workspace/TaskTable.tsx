
import React from "react";

interface Task {
  name: string;
  status: "Done" | "In Progress" | "Pending";
  dueDate: string;
}

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  const getStatusClass = (status: Task["status"]) => {
    switch (status) {
      case "Done":
        return "bg-emerald-100 text-emerald-700";
      case "In Progress":
        return "bg-amber-100 text-amber-700";
      case "Pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="border border-gray-200 overflow-hidden rounded-lg w-full">
      <div className="bg-gray-50 grid grid-cols-[2fr_1fr_1fr] max-sm:hidden">
        <div className="text-sm text-gray-600 font-medium px-4 py-[9px]">
          Task
        </div>
        <div className="text-sm text-gray-600 font-medium px-4 py-[9px]">
          Status
        </div>
        <div className="text-sm text-gray-600 font-medium px-4 py-[9px]">
          Due Date
        </div>
      </div>

      {tasks.map((task, index) => (
        <div
          key={index}
          className="border-t border-gray-200 grid grid-cols-[2fr_1fr_1fr] items-center max-sm:grid-cols-1 max-sm:gap-2 max-sm:py-3 hover:bg-opacity-50"
        >
          <div className="text-sm text-gray-700 px-4 py-[9.5px] max-sm:font-medium">
            {task.name}
          </div>
          <div className="px-4 py-[6.5px]">
            <span
              className={`${getStatusClass(task.status)} text-xs px-2 py-1 rounded-full inline-block`}
            >
              {task.status}
            </span>
          </div>
          <div className="text-sm text-gray-700 px-4 py-[9.5px] max-sm:text-xs max-sm:text-gray-500">
            {task.dueDate}
          </div>
        </div>
      ))}
    </div>
  );
}
