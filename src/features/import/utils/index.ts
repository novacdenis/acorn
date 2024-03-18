import type { ExtractedTransaction } from "../types";

import DOMPurify from "dompurify";

export class VBHtmlParser {
  private document: HTMLElement;

  constructor(html: string) {
    this.document = DOMPurify.sanitize(html, {
      RETURN_DOM: true,
    });
  }

  private groupByMonth(elements: HTMLElement[]) {
    const groups: {
      date: string;
      operations: HTMLElement[];
    }[] = [];

    for (const el of elements) {
      if (el.className === "month-delimiter") {
        groups.push({ date: el.textContent || "", operations: [] });
      } else {
        groups[groups.length - 1].operations.push(el);
      }
    }

    return groups;
  }

  private parseDate(date: string, day: string, time: string) {
    const [dayNumber] = day.split(" ");
    const [hours, minutes] = time.split(":");
    const [month, year] = date.split(" ");

    return new Date(`${year} ${month} ${dayNumber} ${hours}:${minutes}`);
  }

  private extractDescription(element: HTMLElement) {
    const description = element.querySelector(".history-item-description a");

    if (!description) {
      throw new Error("Description not found.");
    }

    return description.textContent?.trim() || "";
  }

  private extractCategory(element: HTMLElement) {
    const category = element.querySelector<HTMLElement>(".history-item-state")?.dataset.category;

    if (!category) {
      throw new Error("Category not found.");
    }

    return category;
  }

  private extractDay(element: HTMLElement) {
    const day = element.querySelector(".day-header");

    if (!day) {
      throw new Error("Day not found.");
    }

    return day.textContent?.trim() || "";
  }

  private extractTime(element: HTMLElement) {
    const time = element.querySelector(".history-item-time");

    if (!time) {
      throw new Error("Time not found.");
    }

    return time.textContent?.trim() || "";
  }

  private extractAmount(element: HTMLElement) {
    const amount = element.querySelector(".history-item-amount.total");
    const transactionAmount = element.querySelector(".history-item-amount.transaction");

    if (!amount && !transactionAmount) {
      throw new Error(
        "Amount not found. Neither `.history-item-amount.total` nor `.history-item-amount.transaction` found."
      );
    }

    if (amount?.querySelector(".amount")) {
      return amount.querySelector(".amount")?.textContent || "0";
    }

    if (transactionAmount?.querySelector(".amount")) {
      return transactionAmount.querySelector(".amount")?.textContent || "0";
    }

    throw new Error("Amount not found. Neither `.amount` found.");
  }

  parse() {
    const transactions: ExtractedTransaction[] = [];
    const grouped = this.groupByMonth(
      Array.from(this.document.querySelectorAll(".operations > div")) as HTMLElement[]
    );

    for (const group of grouped) {
      const date = group.date;
      const operations = group.operations;

      for (const operation of operations) {
        const history = Array.from(operation.querySelectorAll(".history-item")) as HTMLElement[];

        for (const item of history) {
          const errors: string[] = [];

          let day = "";
          let time = "";
          let description = "";
          let category = "";
          let amount = "";

          try {
            day = this.extractDay(item);
          } catch (error) {
            errors.push((error as Error).message);
          }

          try {
            time = this.extractTime(item);
          } catch (error) {
            errors.push((error as Error).message);
          }

          try {
            description = this.extractDescription(item);
          } catch (error) {
            errors.push((error as Error).message);
          }

          try {
            category = this.extractCategory(item);
          } catch (error) {
            errors.push((error as Error).message);
          }

          try {
            amount = this.extractAmount(item);
          } catch (error) {
            errors.push((error as Error).message);
          }

          transactions.push({
            data: {
              category,
              description,
              amount: parseFloat(amount),
              timestamp: this.parseDate(date, day, time).getTime(),
            },
            status: "extracted",
            errors: [],
          });
        }
      }
    }

    return transactions;
  }
}
