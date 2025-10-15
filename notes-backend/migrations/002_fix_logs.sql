-- Drop old logs table
DROP TABLE IF EXISTS logs CASCADE;

-- Create logs table for request logging with correct structure
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    datetime TIMESTAMP NOT NULL,
    method VARCHAR(10) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    headers JSONB,
    payload JSONB,
    response JSONB,
    status_code INTEGER
);

-- Create index
CREATE INDEX idx_logs_datetime ON logs(datetime);
