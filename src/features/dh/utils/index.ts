import type { ExtractedTransaction } from "../types";

import DOMPurify from "dompurify";

export class VBHtmlParser {
  private document: HTMLElement;

  constructor(html: string) {
    this.document = DOMPurify.sanitize(html, {
      RETURN_DOM: true,
    });
  }

  private extractTextContent(element: HTMLElement, selector: string) {
    return element.querySelector(selector)?.textContent?.trim() || "";
  }

  private extractDataAttribute(element: HTMLElement, selector: string, attribute: string) {
    return element.querySelector<HTMLElement>(selector)?.dataset[attribute] || "";
  }

  private toNumber(value: string) {
    return parseFloat(value.replace(",", ""));
  }

  private toDate(date: string, day: string, time: string) {
    const [month, year] = date.split(" ");
    const [dayNumber] = day.split(" ");
    const [hours, minutes] = time.split(":");

    return new Date(`${year} ${month} ${dayNumber} ${hours}:${minutes}`);
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

  parse() {
    const extractedTransactions: ExtractedTransaction[] = [];
    const groups = this.groupByMonth(
      Array.from(this.document.querySelectorAll<HTMLElement>(".operations > div"))
    );

    for (const group of groups) {
      const month = group.month;
      const days = group.days;

      if (!month || days.length === 0) {
        continue;
      }

      for (const day of days) {
        const date = day.querySelector(".day-header")?.textContent || "";
        const history = Array.from(day.querySelectorAll<HTMLElement>(".history-item"));

        if (!date || history.length === 0) {
          continue;
        }

        for (const item of history) {
          const description = this.extractTextContent(item, ".history-item-description a");
          const category = this.extractDataAttribute(item, ".history-item-state", "category");
          const total = this.extractTextContent(item, ".history-item-amount.total .amount");
          const transaction = this.extractTextContent(
            item,
            ".history-item-amount.transaction .amount"
          );
          const amount = this.toNumber(total || transaction || "0");
          const time = this.extractTextContent(item, ".history-item-time");
          const timestamp = this.toDate(month, date, time);

          extractedTransactions.push({
            uid: Math.random().toString(36).substring(2, 9),
            data: {
              category,
              description,
              amount,
              timestamp,
            },
            status: "idle",
          });
        }
      }
    }

    return extractedTransactions;
  }
}
