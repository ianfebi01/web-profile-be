/*
  Warnings:

  - Added the required column `location` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "location" TEXT NOT NULL;
