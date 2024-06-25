-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "price1h" DOUBLE PRECISION,
ADD COLUMN     "realizedProfit" DOUBLE PRECISION,
ADD COLUMN     "unrealizedProfit" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "blockNumber" INTEGER;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "lastTransaction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
