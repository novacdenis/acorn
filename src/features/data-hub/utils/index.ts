import type { Bank, ExtractedTransaction, ExtractedTransactionData, ProcessedFile } from "../types";

import DOMPurify from "dompurify";
import { validateFile } from "@/utils";

export function generateUUID(used: string[]) {
  const uid = Math.random().toString(36).substring(2, 9);

  if (used.includes(uid)) {
    return generateUUID(used);
  }

  return uid;
}

export class VBHtmlParser {
  private document: HTMLElement;

  constructor(html: string) {
    this.document = DOMPurify.sanitize(html, {
      RETURN_DOM: true,
    });
  }

  private groupByMonth(elements: HTMLElement[]) {
    const groups: {
      month: string;
      days: HTMLElement[];
    }[] = [];

    for (const el of elements) {
      if (el.className === "month-delimiter") {
        groups.push({ month: el.textContent || "", days: [] });
      } else {
        groups[groups.length - 1].days.push(el);
      }
    }

    return groups;
  }

  private extractDescription(element: HTMLElement) {
    const description = element.querySelector(".history-item-description a")?.textContent?.trim();

    if (!description) {
      throw new Error("Description not found");
    }

    return description;
  }

  private extractCategory(element: HTMLElement) {
    const category = element.querySelector<HTMLElement>(".history-item-state")?.dataset.category;

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  private extractTime(element: HTMLElement) {
    const time = element.querySelector(".history-item-time")?.textContent?.trim();

    if (!time) {
      throw new Error("Time not found");
    }

    return time;
  }

  private extractAmount(element: HTMLElement) {
    const total = element.querySelector(".history-item-amount.total .amount")?.textContent?.trim();
    const transaction = element
      .querySelector(".history-item-amount.transaction .amount")
      ?.textContent?.trim();

    if (!total && !transaction) {
      throw new Error("Amount not found");
    }

    const amount = Number((total || transaction)?.replaceAll(",", ""));

    if (!amount || isNaN(amount)) {
      throw new Error("Invalid amount");
    }

    return amount;
  }

  private parseDate(monthYear: string, day: string, time: string) {
    const [month, year] = monthYear.split(" ");
    const [dayNumber] = day.split(" ");
    const [hours, minutes] = time.split(":");

    if (!month || !year || !dayNumber || !hours || !minutes) {
      throw new Error("Invalid date");
    }

    const date = new Date(`${year} ${month} ${dayNumber} ${hours}:${minutes}`);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date;
  }

  parse() {
    const transactions: ExtractedTransaction[] = [];
    const groups = this.groupByMonth(
      Array.from(this.document.querySelectorAll<HTMLElement>(".operations > div"))
    );

    for (const group of groups) {
      const month = group.month;

      if (!month || group.days.length === 0) {
        continue;
      }

      for (const day of group.days) {
        const date = day.querySelector(".day-header")?.textContent || "";
        const history = Array.from(day.querySelectorAll<HTMLElement>(".history-item"));

        if (!date || history.length === 0) {
          continue;
        }

        for (const item of history) {
          const errors: { [K in keyof ExtractedTransactionData]?: string } = {};

          let description = "";
          let category = "";
          let timestamp = "";
          let amount = 0;

          try {
            description = this.extractDescription(item);
          } catch (error) {
            errors.description = (error as Error).message;
          }

          try {
            category = this.extractCategory(item);
          } catch (error) {
            errors.category = (error as Error).message;
          }

          try {
            timestamp = this.parseDate(month, date, this.extractTime(item)).toISOString();
          } catch (error) {
            errors.timestamp = (error as Error).message;
          }

          try {
            amount = this.extractAmount(item);
          } catch (error) {
            errors.amount = (error as Error).message;
          }

          transactions.push({
            uid: generateUUID(transactions.map((t) => t.uid)),
            data: {
              category,
              description,
              amount,
              timestamp,
            },
            ...(Object.keys(errors).length ? { status: "error", errors } : { status: "pending" }),
          });
        }
      }
    }

    return transactions;
  }
}

export function processFiles(
  files: File[],
  options: {
    bank: Bank;
    /** The max file size in Bytes. */
    size?: number;
    extensions?: string[];
  }
) {
  const processedFiles: ProcessedFile[] = [];

  for (const file of files) {
    const error = validateFile(file, options);

    processedFiles.push({
      uid: generateUUID(processedFiles.map((f) => f.uid)),
      name: file.name.split(".").slice(0, -1).join("."),
      extension: file.name.split(".").pop() || "",
      size: file.size,
      originalFile: file,
      bank: options.bank,
      ...(error ? { status: "error", error } : { status: "extracting" }),
    });
  }

  return processedFiles;
}

export async function extractTransactions(file: ProcessedFile) {
  const extractedTransactions: ExtractedTransaction[] = [];

  try {
    const text = await file.originalFile.text();
    const parser = { vb: new VBHtmlParser(text) }[file.bank];
    const transactions = parser.parse();

    if (!transactions) {
      throw new Error("The file is not supported.");
    }
    if (transactions.length === 0) {
      throw new Error("No transactions found in the file.");
    }

    extractedTransactions.push(...transactions);
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: { [file.uid]: error.message } };
    }

    return { data: null, error: { [file.uid]: "Something went wrong while reading the file." } };
  }

  return { data: extractedTransactions, error: null };
}
