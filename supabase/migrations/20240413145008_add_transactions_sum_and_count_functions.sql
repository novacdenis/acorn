CREATE FUNCTION transactions_sum(categories) RETURNS REAL AS $$
  SELECT SUM(amount) FROM transactions WHERE category_id = $1.id;
$$ LANGUAGE SQL;

CREATE FUNCTION transactions_count(categories) RETURNS REAL AS $$
  SELECT COUNT(*) FROM transactions WHERE category_id = $1.id;
$$ LANGUAGE SQL;
