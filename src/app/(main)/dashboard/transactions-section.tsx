import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section";
import {
  TransactionItem,
  TransactionItemAmount,
  TransactionItemCategory,
  TransactionItemDescription,
  TransactionItemIcon,
  TransactionItemTimestamp,
  Transactions,
  TransactionsHeader,
  TransactionsList,
} from "@/features/monitoring";

export default function TransactionsSection() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Transactions</SectionTitle>
        <SectionDescription>Track financial activities over time.</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <Transactions>
          <TransactionsHeader />
          <TransactionsList>
            <TransactionItem>
              <TransactionItemIcon>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path
                    d="m62.13 73.7h-24.26c-1.83 0-3.32 1.49-3.32 3.32s1.49 3.32 3.32 3.32h24.25c1.83 0 3.32-1.49 3.32-3.32s-1.48-3.32-3.31-3.32z"
                    fill="#a59d93"
                  />
                  <path
                    d="m78.71 32.71c0-15.85-12.85-28.71-28.71-28.71s-28.71 12.86-28.71 28.71c0 7.69 3.75 14.07 7.95 19.83 4.54 6.23 4.03 11.41 4.03 11.41 0 2.74 2.22 4.96 4.96 4.96h23.55c2.74 0 4.96-2.22 4.96-4.96 0 0-.5-5.18 4.03-11.41 4.19-5.76 7.94-12.14 7.94-19.83z"
                    fill="#ffe08a"
                  />
                  <path
                    d="m61.95 85.12h-23.9c-1.48 0-2.57 1.43-2.14 2.85 1.56 5.19 7.28 9.03 14.09 9.03s12.53-3.84 14.09-9.03c.43-1.41-.66-2.85-2.14-2.85z"
                    fill="#a59d93"
                  />
                </svg>
              </TransactionItemIcon>
              <TransactionItemDescription color="#9333ea">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, doloribus.
              </TransactionItemDescription>
              <TransactionItemCategory>Utilities</TransactionItemCategory>
              <TransactionItemAmount>$100.00</TransactionItemAmount>
              <TransactionItemTimestamp dateTime="2021-01-01">Jan 1, 2021</TransactionItemTimestamp>
            </TransactionItem>
          </TransactionsList>
          <div className="flex h-12 items-center justify-end border-t border-t-primary/10 bg-primary/5 px-2">
            <span className="text-sm">1-5 of 9</span>
            <Button variant="ghost" size="icon" className="ml-4">
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="ml-2">
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </Transactions>
      </SectionContent>
    </Section>
  );
}
