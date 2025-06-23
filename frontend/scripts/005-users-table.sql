-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on email_verified for filtering
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(email_verified);

-- Insert some sample data for testing
INSERT INTO users (email, name, email_verified, email_verified_at) 
VALUES 
    ('admin@fravvo.com', 'Admin User', true, NOW()),
    ('demo@fravvo.com', 'Demo User', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Display current users
SELECT 
    id,
    email,
    name,
    email_verified,
    email_verified_at,
    created_at
FROM users 
ORDER BY created_at DESC;
