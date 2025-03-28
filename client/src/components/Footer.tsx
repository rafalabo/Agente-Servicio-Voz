import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Keyboard, History } from "lucide-react";

interface FooterProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export default function Footer({ audioEnabled, onToggleAudio }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Powered by <span className="text-primary">ElevenLabs</span>
        </div>
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon" onClick={onToggleAudio} title={audioEnabled ? "Disable audio responses" : "Enable audio responses"}>
            {audioEnabled ? (
              <Volume2 className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors duration-200" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors duration-200" />
            )}
          </Button>
          <Button variant="ghost" size="icon" title="Keyboard input (coming soon)">
            <Keyboard className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors duration-200" />
          </Button>
          <Button variant="ghost" size="icon" title="History (coming soon)">
            <History className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors duration-200" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
