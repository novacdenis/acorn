import { round } from "./formatters";

type Unit = "Bytes" | "KB" | "MB" | "GB" | "TB";

export function validateFile(
  file: File,
  options: {
    /** The max file size in Bytes. */
    size?: number;
    extensions?: string[];
  }
) {
  const f = bytesToSize;

  if (options.size && file.size > options.size) {
    return `File size should be less than ${f(options.size)}. This file is ${f(file.size)}`;
  }

  if (options.extensions) {
    const fileExtension = `.${file.name.split(".").pop() ?? ""}`;

    if (options.extensions.indexOf(fileExtension) === -1) {
      return `File extension should be one of: ${options.extensions.join(
        ", "
      )}. Current file extension is ${fileExtension}`;
    }
  }
}

export function bytesToSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const units: Unit[] = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${round(bytes / Math.pow(1024, i))} ${units[i < 0 ? 0 : i]}`;
}

export function sizeToBytes(size: number, unit: Unit) {
  if (unit === "Bytes") return size;

  const units: Unit[] = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = units.indexOf(unit);

  return size * Math.pow(1024, i);
}
