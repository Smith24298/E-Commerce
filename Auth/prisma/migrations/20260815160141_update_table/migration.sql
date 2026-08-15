-- AlterEnum
ALTER TYPE "user_status" ADD VALUE 'VERIFIED';

-- AlterTable
ALTER TABLE "emailVerificationToken" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
