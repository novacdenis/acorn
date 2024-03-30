"use client";

import type { DataHubFile } from "../../types";

import { Row } from "./row";
import { Toolbar } from "./toolbar";

export interface FilesTableProps {
  files: DataHubFile[];
}

export const FilesTable: React.FC<FilesTableProps> = ({ files }) => {
  return (
    <>
      <Toolbar />
      <div className="mt-5 overflow-hidden rounded-2xl border border-primary/10">
        <ul role="table" className="relative list-none [&>li:not(:first-child)]:border-t">
          {files.map((file) => (
            <Row key={file.id} file={file} />
          ))}
        </ul>
      </div>
    </>
  );
};
