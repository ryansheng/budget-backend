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
      categories, senderId:senderUserId,recipientId:recipientUserId , amount, date, regular, frequency, start } = req.body 
    
    const senderAccount = await prisma.account.findFirst({
      where: { userId: senderUserId }
    });
    if (!senderAccount) {
      return res.status(404).json({ error: "Sender account not found" });
    }
    const recipientAccount = await prisma.account.findFirst({
      where: { userId: recipientUserId }
    });
    if (!recipientAccount) {
      return res.status(404).json({ error: "Recipient account not found" });
    }
     const transaction = await prisma.transaction.create({
      data: {
        categories,
        senderId: senderAccount.id,       
        recipientId: recipientAccount.id, 
        amount,
        date,
        regular,
        frequency,
        start
      }
    });
    res.json(transaction)
    
  } catch (err) {
    console.error("error creating transaction:", err);
    res.status(500).json({ error: "failed to create transaction" });
    }
}
  

async function updateTransaction(req: Request, res: Response) {
  try {
    const {
      categories,
      senderId: senderUserId,
      recipientId: recipientUserId,
      amount,
      date,
      regular,
      frequency,
      start
    } = req.body;

    // 1. Find sender's account
    const senderAccount = await prisma.account.findFirst({
      where: { userId: senderUserId }
    });

    if (!senderAccount) {
      return res.status(404).json({ error: "Sender account not found" });
    }

    // 2. Find recipient's account
    const recipientAccount = await prisma.account.findFirst({
      where: { userId: recipientUserId }
    });

    if (!recipientAccount) {
      return res.status(404).json({ error: "Recipient account not found" });
    }

   
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id as string },
      data: {
        categories,
        senderId: senderAccount.id,       
        recipientId: recipientAccount.id, 
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
async function getTransactionByUserId(req: Request, res: Response):Promise<void> {
  try {
    const user_id = Array.isArray(req.params.user_id)
      ? req.params.user_id[0]
      : req.params.user_id; 

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: user_id },
          { recipientId: user_id }
        ]
      }
    })
    res.json(transactions)
  } catch (err) {
    console.error('getTransactionbyUserId failed', err)
    res.status(500).json({ error:'failed to fetch user transactions by id'})
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