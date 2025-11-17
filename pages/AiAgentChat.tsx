import React, { useState, useEffect, useRef, FormEvent } from "react";
import { ChatSession } from "@google/generative-ai";

// --- Import the REAL service ---
import { createAiChat } from "../services/geminiService"; // <-- CORRECT IMPORT

// --- Import types ---
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  isLoading: boolean;
}

// --- Import UI components (assuming they are in separate files) ---
// Make sure these paths are correct for your project
import { Button, Input, Card } from "./ui";
import { Icons } from "./Icons";

// --- Main AiAgentChat Component ---

const AiAgentChat: React.FC<{ userRole: Role }> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const systemInstruction =
      userRole === Role.ADMIN
        ? "You are an expert administrative assistant for CampusStays. Help admins with booking approvals, generating reports on occupancy rates, and providing analytics on revenue. Keep responses concise and professional."
        : "You are a friendly and helpful concierge for CampusStays. Help users find rooms, answer questions about amenities, and guide them through the booking process. Be welcoming and clear.";

    // This now calls the REAL service from ../services/geminiService
    const chatInstance = createAiChat(systemInstruction);
    setChat(chatInstance);

    setMessages([
      {
        id: "initial",
        sender: "ai",
        text:
          userRole === Role.ADMIN
            ? "Hello Admin. How can I assist with reports or approvals today?"
            : "Welcome! How can I help you find the perfect room?",
        isLoading: false,
      },
    ]);
  }, [userRole]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      isLoading: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        text: "",
        sender: "ai",
        isLoading: true,
      },
    ]);

    try {
      let streamedText = "";

      const result = await chat.sendMessageStream(currentInput);

      for await (const chunk of result.stream) {
        streamedText += chunk.text();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, text: streamedText, isLoading: false }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: "Sorry, I encountered an error. Please try again.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <Icons.bot className="w-6 h-6" />
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window */}
          <div className="fixed bottom-24 right-6 z-50">
            <Card className="flex flex-col h-[32rem] w-96 shadow-2xl">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-blue-600 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Icons.bot className="w-6 h-6" />
                    <span>AI Assistant</span>
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label="Close chat"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icons.bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-3 ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-lg"
                          : "bg-gray-200 text-gray-900 rounded-lg"
                      }`}
                    >
                      {msg.isLoading ? (
                        <div className="flex items-center justify-center space-x-1.5">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 flex items-center gap-3 bg-white rounded-b-lg"
              >
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 !py-3"
                  autoComplete="off"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  className="!p-3 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  <Icons.send className="w-5 h-5" />
                </Button>
              </form>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default AiAgentChat;