'use server'

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/types';

const usersFilePath = path.join(process.cwd(), 'src/data/users.json');

async function getUsersFromFile(): Promise<User[]> {
    try {
        const jsonData = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

async function writeUsers(users: User[]) {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing users file:', error);
    throw new Error('Could not save users data.');
  }
}

export async function getUsers(): Promise<User[]> {
    return await getUsersFromFile();
}

export async function deleteUser(id: string) {
  let users = await getUsersFromFile();
  // Prevent deleting the main admin user for demo purposes
  if (id === 'user-3') {
    throw new Error("Cannot delete the main administrator account.");
  }
  users = users.filter(u => u.id !== id);
  await writeUsers(users);
  
  revalidatePath('/admin/dashboard/users');
  revalidatePath('/admin/dashboard');
}

export async function updateUser(updatedUser: User) {
    let users = await getUsersFromFile();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex === -1) {
        throw new Error("User not found");
    }
    users[userIndex] = updatedUser;
    await writeUsers(users);

    revalidatePath('/admin/dashboard/users');
    revalidatePath('/admin/dashboard');
}
