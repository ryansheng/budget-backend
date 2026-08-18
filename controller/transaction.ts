import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { Transaction } from "../types/transcation";

async function getTransactions(req: Request, res: Response) {
  try {
    const transaction: Transaction[] = await prisma.transaction.findMany();
    res.json(transaction);
  } catch (err) {
    console.error("getTransactions error:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}

async function getTransactionById(req: Request, res: Response) {
  try {
    const transaction: Transaction | null = await prisma.transaction.findUnique({
      where:{id:req.params.id as string }
    })
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' })
    res.json(transaction)
  } catch (err) {
    console.error('getTransactionById', err)
    res.status(500).json({error:'failed to fetch transaction'})
  }
}

async function createTransaction(req: Request, res: Response) {
  try {
    const {
      categories,
      senderId,        // now accountId
      recipientId,     // now accountId
      amount,
      date,
      regular,
      frequency,
      start
    } = req.body;

    // 1. Look up sender account by ACCOUNT ID
    const senderAccount = await prisma.account.findUnique({
      where: { id: senderId }
    });

    if (!senderAccount) {
      return res.status(404).json({ error: "Sender account not found" });
    }

    // 2. Look up recipient account by ACCOUNT ID
    const recipientAccount = await prisma.account.findUnique({
      where: { id: recipientId }
    });

    if (!recipientAccount) {
      return res.status(404).json({ error: "Recipient account not found" });
    }

    // 3. Create transaction using account IDs
    const transaction = await prisma.transaction.create({
      data: {
        categories,
        senderId,
        recipientId,
        amount,
        date,
        regular,
        frequency,
        start
      }
    });

    res.json(transaction);

  } catch (err) {
    console.error("error creating transaction:", JSON.stringify(err, null, 2));
    res.status(500).json({ error: "failed to create transaction" });
  }
}


  


async function updateTransaction(req: Request, res: Response) {
  try {
    const {
      categories,
      senderId,        // now accountId
      recipientId,     // now accountId
      amount,
      date,
      regular,
      frequency,
      start
    } = req.body;

    const senderAccount = await prisma.account.findUnique({
      where: { id: senderId }
    });

    if (!senderAccount) {
      return res.status(404).json({ error: "Sender account not found" });
    }

    const recipientAccount = await prisma.account.findUnique({
      where: { id: recipientId }
    });

    if (!recipientAccount) {
      return res.status(404).json({ error: "Recipient account not found" });
    }

    const transaction = await prisma.transaction.update({
      where: { id: req.params.id as string },
      data: {
        categories,
        senderId,
        recipientId,
        amount,
        date,
        regular,
        frequency,
        start
      }
    });

    res.json(transaction);

  } catch (err) {
    console.error("updating transaction error:", err);

    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(500).json({ error: "failed to update transaction" });
  }
}


async function deleteTransaction(req: Request, res: Response) {
  try {
    await prisma.transaction.delete({
      where: { id: req.params.id as string }
    });
     res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("delete transaction failed:", err);
    res.status(500).json({ error: "failed to delete transaction" });
  }
}

async function getTransactionByUserId(req: Request, res: Response){
  try {
    const raw = req.params.user_id;
    const userId = Array.isArray(raw) ? raw[0] : raw;

   
    const account = await prisma.account.findFirst({
      where: { userId }
    });

    if (!account) {
      return res.status(404).json({ error: "Account for user not found" });
    }

    
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: account.id },
          { recipientId: account.id }
        ]
      }
    });

    res.json(transactions);

  } catch (err) {
    console.error("getTransactionByUserId failed", err);
    res.status(500).json({ error: "failed to fetch user transactions by id" });
  }
}


async function getTransactionByAccountId(req: Request, res: Response) {
 try {
   const raw = req.params.accountId;
    const accountId = Array.isArray(raw) ? raw[0] : raw; 

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: accountId },
          { recipientId: accountId }
        ]
      },
      orderBy: { date: 'desc' }
    });

    res.json(transactions);
  } catch (err) {
    console.error('Error fetching account transactions:', err);
    res.status(500).json({ error: 'Failed to fetch account transactions' });
  }
}
export {
  getTransactionByAccountId,
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionByUserId
};