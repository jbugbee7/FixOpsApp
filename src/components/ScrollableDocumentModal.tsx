
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface ScrollableDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  title: string;
  children: React.ReactNode;
  isAccepted: boolean;
}

const ScrollableDocumentModal = ({
  isOpen,
  onClose,
  onAccept,
  title,
  children,
  isAccepted
}: ScrollableDocumentModalProps) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [tempAccepted, setTempAccepted] = useState(isAccepted);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      setTempAccepted(isAccepted);
    }
  }, [isOpen, isAccepted]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setTempAccepted(checked);
    if (checked && hasScrolledToBottom) {
      // Automatically accept and close modal when checkbox is checked
      onAccept();
      onClose();
    }
  };

  const handleAccept = () => {
    if (tempAccepted) {
      onAccept();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </DialogHeader>
        
        <ScrollArea 
          className="flex-1 pr-4" 
          onScrollCapture={handleScroll}
        >
          <div className="text-sm leading-relaxed">
            {children}
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col space-y-4 sm:flex-col sm:space-x-0">
          {!hasScrolledToBottom && (
            <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
              Please scroll to the bottom to read the complete document before agreeing.
            </p>
          )}
          
          <div className="flex items-center space-x-2 justify-center">
            <Checkbox
              id={`accept-${title.toLowerCase().replace(/\s+/g, '-')}`}
              checked={tempAccepted}
              onCheckedChange={handleCheckboxChange}
              disabled={!hasScrolledToBottom}
            />
            <label
              htmlFor={`accept-${title.toLowerCase().replace(/\s+/g, '-')}`}
              className={`text-sm font-medium ${!hasScrolledToBottom ? 'text-muted-foreground' : ''}`}
            >
              I have read and agree to the {title}
            </label>
          </div>

          <div className="flex space-x-2 justify-center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!tempAccepted || !hasScrolledToBottom}
            >
              Accept
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScrollableDocumentModal;
