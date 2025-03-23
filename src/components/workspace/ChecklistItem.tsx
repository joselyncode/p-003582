import React from "react";

interface ChecklistItemProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function ChecklistItem({
  label,
  checked = false,
  onChange,
}: ChecklistItemProps) {
  const [isChecked, setIsChecked] = React.useState(checked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className="w-[13px] h-[13px]"
        checked={isChecked}
        onChange={handleChange}
      />
      <span className="text-base text-gray-700">{label}</span>
    </div>
  );
}
