/*
  Warnings:

  - The `year` column on the `Portofolio` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Portofolio" DROP COLUMN "year",
ADD COLUMN     "year" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
