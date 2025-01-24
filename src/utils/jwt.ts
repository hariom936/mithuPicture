import jwt from 'jsonwebtoken';

// Secret key for signing the JWT (should be stored in environment variables for security)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Function to generate a JWT token
export function generateJwtToken(userId: number, email: string, password: number, role: string) {
  const payload = {
    userId,
    email,
    password,
    role,
  };

  // Generate JWT token with a 1-hour expiration
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
