// src/components/UploadBotFile.tsx
import React, { useRef } from "react";

interface BotData {
  name: string;
  version: string;
  strategy: string;
  investment_amount: number;
  gain_chance: number;
  max_loss_percent: number;
  min_gain_percent: number;
  duration_seconds: number;
  log: string[];
}

interface Props {
  onBotLoad: (bot: BotData) => void;
}

const UploadBotFile: React.FC<Props> = ({ onBotLoad }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!json.name || !json.strategy || !json.log) {
        throw new Error("Invalid bot file");
      }
      onBotLoad(json);
    } catch (err) {
      alert("Invalid JSON Bot File");
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Upload Bot File (.json)</label>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
    </div>
  );
};

export default UploadBotFile;
