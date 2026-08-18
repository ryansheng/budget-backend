-- Drop old foreign keys pointing to User
ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_senderId_fkey";
ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_recipientId_fkey";

-- Add new foreign keys pointing to Account
ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_senderId_fkey"
FOREIGN KEY ("senderId") REFERENCES "Account"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_recipientId_fkey"
FOREIGN KEY ("recipientId") REFERENCES "Account"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
