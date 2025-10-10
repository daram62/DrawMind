import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 */
class Database {
  private static instance: PrismaClient;

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return Database.instance;
  }

  static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
    }
  }
}

export const prisma = Database.getInstance();

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await Database.disconnect();
});
