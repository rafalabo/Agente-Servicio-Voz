import { forwardRef } from "react";
import { Message } from "@/lib/types";
import MessageItem from "@/components/MessageItem";

interface ConversationHistoryProps {
  messages: Message[];
}

const ConversationHistory = forwardRef<HTMLDivElement, ConversationHistoryProps>(
  ({ messages }, ref) => {
    return (
      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-1 relative z-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        <div ref={ref} />
      </div>
    );
  }
);

ConversationHistory.displayName = "ConversationHistory";

export default ConversationHistory;
