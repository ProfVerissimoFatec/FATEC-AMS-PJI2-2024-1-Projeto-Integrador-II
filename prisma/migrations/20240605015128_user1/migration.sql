-- CreateTable
CREATE TABLE "users" (
    "userID" TEXT NOT NULL,
    "nomeUsuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criacao_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "alteracao_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userID")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userID_key" ON "users"("userID");
