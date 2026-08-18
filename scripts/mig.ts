import { prisma } from "../prismaClient";

async function run() {
  console.log("Starting migration…");

  // 1. Load all accounts
  const accounts = await prisma.account.findMany();
  const userToAccount: Record<string, string> = {};

  for (const acc of accounts) {
    userToAccount[acc.userId] = acc.id;
  }

  console.log("User → Account map:", userToAccount);

  // 2. Load all transactions
  const transactions = await prisma.transaction.findMany();

  for (const tx of transactions) {
    const senderUserId = tx.senderId;
    const recipientUserId = tx.recipientId;

    console.log(`\nProcessing transaction ${tx.id}`);
    console.log("Sender user:", senderUserId);
    console.log("Recipient user:", recipientUserId);

    // 3. Ensure sender has an account
    let senderAccountId = userToAccount[senderUserId];
    if (!senderAccountId) {
      console.log(`Creating missing account for sender user ${senderUserId}`);
      const newAcc = await prisma.account.create({
        data: {
          userId: senderUserId,
          accountType: "checking",
          accountName: "Auto‑Generated",
          balance: 0
        }
      });

      senderAccountId = newAcc.id;
      userToAccount[senderUserId] = newAcc.id;
    }

    // 4. Ensure recipient has an account
    let recipientAccountId = userToAccount[recipientUserId];
    if (!recipientAccountId) {
      console.log(`Creating missing account for recipient user ${recipientUserId}`);
      const newAcc = await prisma.account.create({
        data: {
          userId: recipientUserId,
          accountType: "checking",
          accountName: "Auto‑Generated",
          balance: 0
        }
      });

      recipientAccountId = newAcc.id;
      userToAccount[recipientUserId] = newAcc.id;
    }

    // 5. Update transaction with ACCOUNT IDs
    console.log(
      `Updating transaction ${tx.id} → sender=${senderAccountId}, recipient=${recipientAccountId}`
    );

    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        senderId: senderAccountId,
        recipientId: recipientAccountId
      }
    });

    console.log(`Migrated ${tx.id}`);
  }

  console.log("\nMigration complete.");
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
