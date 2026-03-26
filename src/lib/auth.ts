import type { User } from './types';
import usersData from '@/data/users.json';

// Simulate a network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function attemptLogin(email: string, pass: string): Promise<User | null> {
  await delay(500); // Simulate API call latency
  
  const users: User[] = usersData;
  const user = users.find(u => u.email === email);

  // In a real app, you'd check a hashed password. Here we just check for existence.
  if (user && pass === 'password') {
    return user;
  }
  
  return null;
}
