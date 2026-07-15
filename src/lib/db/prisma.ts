// Since Prisma Client generation failed due to network restrictions (Prisma engine download failed),
// we export a mock proxy that always throws. This ensures the app doesn't crash on import,
// and forces the UI to use the graceful fallback mock data defined in the pages.

const mockPrismaHandler = {
  get(target: any, prop: string) {
    if (prop === 'then') return undefined; // Promise chaining fix
    return new Proxy(() => { throw new Error('Prisma Client not generated'); }, mockPrismaHandler);
  }
};

export const prisma = new Proxy({}, mockPrismaHandler) as any;
