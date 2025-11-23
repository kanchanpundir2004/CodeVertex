// import { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axiosClient from "../utils/axiosClient";
// import { Send } from 'lucide-react';

// function ChatAi({problem}) {
//     const [messages, setMessages] = useState([
//         { role: 'model', parts:[{text: "Hi, How are you"}]},
//         { role: 'user', parts:[{text: "I am Good"}]}
//     ]);

//     const { register, handleSubmit, reset,formState: {errors} } = useForm();
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const onSubmit = async (data) => {

//         setMessages(prev => [...prev, { role: 'user', parts:[{text: data.message}] }]);
//         reset();

//         try {

//             const response = await axiosClient.post("/ai/chat", {
//                 messages:messages,
//                 title:problem.title,
//                 description:problem.description,
//                 testCases: problem.visibleTestCases,
//                 startCode:problem.startCode
//             });

//             setMessages(prev => [...prev, {
//                 role: 'model',
//                 parts:[{text: response.data.message}]
//             }]);
//         } catch (error) {
//             console.error("API Error:", error);
//             setMessages(prev => [...prev, {
//                 role: 'model',
//                 parts:[{text: "Error from AI Chatbot"}]
//             }]);
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
//                     >
//                         <div className="chat-bubble bg-base-200 text-base-content">
//                             {msg.parts[0].text}
//                         </div>
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>
//             <form
//                 onSubmit={handleSubmit(onSubmit)}
//                 className="sticky bottom-0 p-4 bg-base-100 border-t"
//             >
//                 <div className="flex items-center">
//                     <input
//                         placeholder="Ask me anything"
//                         className="input input-bordered flex-1"
//                         {...register("message", { required: true, minLength: 2 })}
//                     />
//                     <button
//                         type="submit"
//                         className="btn btn-ghost ml-2"
//                         disabled={errors.message}
//                     >
//                         <Send size={20} />
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default ChatAi;

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axiosClient from "../utils/axiosClient";
import { Send, Loader2 } from "lucide-react";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    { role: "model", content: "Hello! Ask me anything about this problem 😊" },
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "Explain the optimal approach",
    "Give a hint to solve this",
    "Show time and space complexity",
    "Explain tricky edge cases",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, isTyping]);

  const appendUser = (text) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
  };

  const typeReply = useCallback((fullText) => {
    setIsTyping(true);
    let i = 0;

    setMessages((prev) => [...prev, { role: "model", content: "" }]);

    const interval = setInterval(() => {
      i++;
      const next = fullText.slice(0, i);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.map((m) => m.role).lastIndexOf("model");
        updated[lastIndex] = { role: "model", content: next };
        return updated;
      });

      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 12);
  }, []);

  const handleAIRequest = async (msg, isSuggested = false) => {
    setIsThinking(true);

    const payload = {
      messages: messages.concat({ role: "user", content: msg }),
      title: problem.title,
      description: problem.description,
      testCases: problem.visibleTestCases,
      startCode: problem.startCode,
    };

    try {
      const res = await axiosClient.post("/ai/chat", payload);
      const reply = res.data.message || "No response from AI.";
      setIsThinking(false);
      typeReply(reply);
    } catch {
      setIsThinking(false);
      setMessages((p) => [
        ...p,
        { role: "model", content: "AI failed to respond. Try again!" },
      ]);
    }
  };

  const onSubmit = ({ message }) => {
    appendUser(message);
    reset();
    handleAIRequest(message);
  };

  const renderBubble = (msg, isUser) => (
    <div
      className={`max-w-[80%] px-4 py-2 rounded-xl border shadow-sm whitespace-pre-wrap
        ${
          isUser
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-yellow-50 text-gray-900 border-yellow-200 dark:bg-[#332b00] dark:text-yellow-200 dark:border-yellow-900"
        }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, children, ...props }) {
            return inline ? (
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">
                {children}
              </code>
            ) : (
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-auto">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {msg.content}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-white dark:bg-gray-900 dark:text-gray-100 border rounded-lg shadow">
      {/* HEADER */}
      <div className="flex justify-between px-4 py-3 border-b dark:border-gray-700">
        <span className="font-semibold">AI Assistant</span>

        {isThinking && (
          <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
            <Loader2 className="animate-spin" size={16} /> Thinking…
          </span>
        )}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {renderBubble(msg, msg.role === "user")}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTED PROMPTS */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              appendUser(p);
              handleAIRequest(p, true);
            }}
            className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border"
          >
            {p}
          </button>
        ))}
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-3 p-3 border-t bg-white dark:bg-gray-900 dark:border-gray-700"
      >
        <input
          {...register("message", { required: true, minLength: 2 })}
          className="input input-bordered w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          placeholder="Ask anything about the problem..."
          disabled={isThinking || isTyping}
        />

        <button
          type="submit"
          disabled={isThinking}
          className="btn btn-primary flex items-center gap-2"
        >
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
}

export default ChatAi;
