
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "../navigation/Sidebar";
import { useSettings } from "@/hooks/use-settings";

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userAvatar?: string;
}

export function MobileDrawer({ open, onOpenChange, userAvatar }: MobileDrawerProps) {
  const { settings } = useSettings();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 max-w-[280px] sm:max-w-sm">
        <Sidebar userName={settings.userName} userAvatar={userAvatar} />
      </SheetContent>
    </Sheet>
  );
}
