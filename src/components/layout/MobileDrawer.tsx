
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "../navigation/Sidebar";

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userAvatar?: string;
  userName?: string;
}

export function MobileDrawer({ open, onOpenChange, userAvatar, userName }: MobileDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 max-w-[280px] sm:max-w-sm">
        <Sidebar userName={userName} userAvatar={userAvatar} />
      </SheetContent>
    </Sheet>
  );
}
