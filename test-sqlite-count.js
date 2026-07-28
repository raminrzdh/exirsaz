const { PrismaClient } = require('@prisma/client')
// We have to overwrite the datasource URL to point to sqlite just for this script
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
})
async function main() {
  try {
    const count = await prisma.product.count()
    console.log("SQLite Total products:", count)
  } catch (e) {
    console.error("Error reading sqlite:", e.message)
  }
}
main().finally(() => prisma.$disconnect())
