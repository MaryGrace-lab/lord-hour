-- CreateTable
CREATE TABLE "LoginAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "username" TEXT NOT NULL,
    "ip" TEXT,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoginAudit_username_createdAt_idx" ON "LoginAudit"("username", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAudit_ip_createdAt_idx" ON "LoginAudit"("ip", "createdAt");
