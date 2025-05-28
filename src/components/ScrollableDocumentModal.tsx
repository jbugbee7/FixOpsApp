
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleClose = () => {
    if (hasScrolledToBottom) {
      onAccept(); // Mark as viewed when closing after reading
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </DialogHeader>
        
        <div className="flex-1 border rounded-md">
          <ScrollArea className="h-[400px] w-full p-4">
            <div 
              className="text-sm leading-relaxed pr-4"
              onScroll={handleScroll}
            >
              {children}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex flex-col space-y-4 sm:flex-col sm:space-x-0">
          {!hasScrolledToBottom && (
            <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
              Please scroll to the bottom to read the complete document.
            </p>
          )}

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleClose}>
              {hasScrolledToBottom ? "Close" : "Cancel"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScrollableDocumentModal;
