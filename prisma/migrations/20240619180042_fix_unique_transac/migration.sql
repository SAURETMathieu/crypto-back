/*
  Warnings:

  - A unique constraint covering the columns `[idx,walletId,cryptoId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Transaction_idx_key";

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idx_walletId_cryptoId_key" ON "Transaction"("idx", "walletId", "cryptoId");
