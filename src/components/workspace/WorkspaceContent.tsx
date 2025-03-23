import React from "react";
import { ChecklistItem } from "./ChecklistItem";
import { TaskTable } from "./TaskTable";

export function WorkspaceContent() {
  const tasks = [
    {
      name: "Setup workspace",
      status: "Done" as const,
      dueDate: "Jan 15, 2025",
    },
    {
      name: "Team onboarding",
      status: "In Progress" as const,
      dueDate: "Jan 20, 2025",
    },
  ];

  const checklistItems = [
    "Create your first page",
    "Invite team members",
    "Set up integrations",
  ];

  return (
    <main className="px-16 py-12 max-md:p-8 max-sm:p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Getting Started</h1>

      <p className="text-base text-gray-700 mb-6">
        Welcome to your workspace. Use this document to get started with the
        basics.
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {checklistItems.map((item, index) => (
          <ChecklistItem key={index} label={item} />
        ))}
      </div>

      <div className="mb-6">
        <TaskTable tasks={tasks} />
      </div>

      <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[14px] h-[16px]"
        >
          <path d="M0 0H14V16H0V0Z" stroke="#E5E7EB" />
          <path
            d="M8 2.5C8 1.94687 7.55312 1.5 7 1.5C6.44688 1.5 6 1.94687 6 2.5V7H1.5C0.946875 7 0.5 7.44688 0.5 8C0.5 8.55312 0.946875 9 1.5 9H6V13.5C6 14.0531 6.44688 14.5 7 14.5C7.55312 14.5 8 14.0531 8 13.5V9H12.5C13.0531 9 13.5 8.55312 13.5 8C13.5 7.44688 13.0531 7 12.5 7H8V2.5Z"
            fill="currentColor"
          />
        </svg>
        <span className="text-sm">Add a block</span>
      </button>
    </main>
  );
}
