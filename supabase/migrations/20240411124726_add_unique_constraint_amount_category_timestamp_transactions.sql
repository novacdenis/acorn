ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_unique UNIQUE (amount, category_id, timestamp);
