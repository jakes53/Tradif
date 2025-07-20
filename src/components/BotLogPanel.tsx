import React, { useEffect, useRef, useState } from "react";
import { useBotLogs } from "@/context/BotLogContext";

const BotLogPanel: React.FC = () => {
  const { logs } = useBotLogs();
  const [isVisible, setIsVisible] = useState(true);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  const container = document.querySelector("#bot-log-scroll");

  if (!container) return;

  const isAtBottom =
    container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

  if (isAtBottom) {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [logs]);



  if (!logs.length || !isVisible) return null;

  return (
    <div 
    id="bot-log-scroll"
    className="relative mt-6 bg-[#0d0d0d] text-sm rounded-md p-4 font-mono max-h-64 overflow-y-auto shadow border border-gray-800">
      {/* Close button */}
      <button
        className="absolute top-2 right-3 text-gray-400 hover:text-white text-xs"
        onClick={() => setIsVisible(false)}
        title="Close log panel"
      >
        ✖
      </button>

      <h2 className="font-bold text-white mb-2">🤖 Bot Activity Log</h2>
      <ul className="space-y-1 text-gray-300">
        {logs.map((log, index) => {
          let color = "text-gray-300";
          if (log.includes("✅") || log.includes("successfully")) color = "text-green-400";
          else if (log.includes("❌") || log.includes("Insufficient")) color = "text-red-400";
          else if (log.includes("📈") || log.includes("📉")) color = "text-yellow-300";
          else if (log.includes("Demo account")) color = "text-blue-400";

          return (
            <li key={index} className={`whitespace-pre-wrap ${color}`}>
              {log}
            </li>
          );
        })}
        <div ref={logEndRef} />
      </ul>
    </div>
  );
};

export default BotLogPanel;
