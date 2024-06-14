/*
  Warnings:

  - A unique constraint covering the columns `[cryptoId,walletId,timestamp]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "percent" DOUBLE PRECISION,
ADD COLUMN     "price24h" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Balance_cryptoId_walletId_timestamp_key" ON "Balance"("cryptoId", "walletId", "timestamp");
