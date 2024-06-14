-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "idx" TEXT NOT NULL,
    "fromAddress" TEXT,
    "toAddress" TEXT,
    "fromLabel" TEXT,
    "toLabel" TEXT,
    "fees" DOUBLE PRECISION,
    "value" DOUBLE PRECISION,
    "status" INTEGER,
    "type" TEXT,
    "timestamp" TIMESTAMP(3),
    "cryptoId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "nbToken" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "walletId" INTEGER NOT NULL,
    "cryptoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idx_key" ON "Transaction"("idx");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
