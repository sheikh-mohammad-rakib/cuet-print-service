import { Client, Databases } from "node-appwrite";

// Initialize the Appwrite Client (Server-Side)
const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!; // Server-only: NOT prefixed with NEXT_PUBLIC_

if (!endpoint || !projectId || !apiKey) {
    throw new Error("Appwrite environment variables are missing");
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

export const adminDatabases = new Databases(client);
