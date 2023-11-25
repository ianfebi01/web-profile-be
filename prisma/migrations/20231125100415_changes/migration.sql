/*
  Warnings:

  - Made the column `quote` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `textBg` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `openToWork` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "quote" SET NOT NULL,
ALTER COLUMN "textBg" SET NOT NULL,
ALTER COLUMN "openToWork" SET NOT NULL;
