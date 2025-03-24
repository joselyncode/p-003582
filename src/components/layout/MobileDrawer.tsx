
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "../navigation/Sidebar";
import { SettingsModal } from "./SettingsModal";
import { Settings } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

interface MobileDrawerProps {
  userAvatar?: string;
  userName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ 
  userAvatar,
  userName,
  open,
  onOpenChange
}: MobileDrawerProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();
  
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0">
          <Sidebar 
            userName={userName || settings.userName} 
            userAvatar={userAvatar || "/images/female-avatar.svg"} 
          />
        </SheetContent>
      </Sheet>

      {/* Mobile settings button (top-right corner on mobile) */}
      <button 
        className="fixed top-4 right-4 z-10 md:hidden p-2 bg-white rounded-full shadow"
        onClick={() => setSettingsOpen(true)}
        aria-label="Configuración"
      >
        <Settings className="h-5 w-5 text-gray-600" />
      </button>
      
      {/* Settings modal */}
      <SettingsModal 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
}
