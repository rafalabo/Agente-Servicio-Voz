import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function Header() {
  const [isConnected] = useState(true);
  
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-indigo-600 flex items-center justify-center shadow-lg">
            <i className="fas fa-robot text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Thomas</h1>
            <p className="text-xs text-muted-foreground">AI Voice Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1 bg-background rounded-full px-3 py-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-muted-foreground">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
