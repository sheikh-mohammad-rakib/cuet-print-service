import { Client, Account, Databases, Storage } from 'appwrite';

// 1. Initialize the Appwrite Client
export const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Project ID

// 2. Export Services so other files can use them
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);