"use client";

import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { VBHtmlParser } from "../utils";

export const Upload: React.FC = () => {
  const [bank, setBank] = React.useState<"vb" | "maib" | null>("vb");

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onUpload = async (file: File) => {
    try {
      const html = await file.text();
      const parser = new VBHtmlParser(html);
      const transactions = parser.parse();
      console.log(transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      onUpload(event.target.files[0]);
    }
    event.target.value = "";
  };

  return (
    <>
      <div
        className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-primary/10 p-5"
        onClick={() => inputRef.current?.click()}
      >
        <ArrowUpTrayIcon className="h-12 w-12 text-primary" />
        <h2 className="text-lg font-medium">Upload a file</h2>
        <p className="text-center text-sm text-primary/60">
          Drag and drop your file here or click to select a file from your computer
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".html"
        className="hidden"
        onChange={onInputChange}
      />
    </>
  );
};
