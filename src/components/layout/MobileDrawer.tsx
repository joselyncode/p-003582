
import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

interface MobileDrawerProps {
  userName: string;
  userAvatar?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ 
  userName, 
  userAvatar, 
  open, 
  onOpenChange 
}: MobileDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] md:hidden">
        <div className="h-full overflow-y-auto">
          <Sidebar userName={userName} userAvatar={userAvatar} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
