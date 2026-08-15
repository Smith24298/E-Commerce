-- AlterTable
ALTER TABLE "passwordResetToken" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
