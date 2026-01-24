import { useState, useCallback } from "react";
import { Message, UseChatReturn } from "../types";
import { ChatApiClient } from "../services/api";

export const useChat = (pdfBase64: string, apiClient: ChatApiClient): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !pdfBase64) return;

      const userMessage: Message = { role: "user", content };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);

      try {
        let assistantMessage = "";

        // Add empty assistant message that we'll update
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        // Filter out empty messages before sending to API
        const messagesToSend = updatedMessages.filter((msg) => msg.content.trim() !== "");

        // Stream the response
        for await (const chunk of apiClient.sendMessage(messagesToSend, pdfBase64)) {
          assistantMessage += chunk;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            };
            return newMessages;
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        console.error("Error Message:", errorMessage);
        setError(errorMessage);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, pdfBase64, apiClient],
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};
