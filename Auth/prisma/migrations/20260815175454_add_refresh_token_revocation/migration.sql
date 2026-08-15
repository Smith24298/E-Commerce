-- AlterTable
ALTER TABLE "refreshToken" ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
