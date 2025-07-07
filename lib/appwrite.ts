import { Client, Account } from 'appwrite';

const appwriteClient = new Client();

appwriteClient
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '') // Your Appwrite Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''); // Your project ID

const appwriteAccount = new Account(appwriteClient);

export { appwriteClient, appwriteAccount }; 