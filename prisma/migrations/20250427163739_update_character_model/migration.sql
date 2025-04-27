/*
  Warnings:

  - You are about to drop the column `category` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `denomination` on the `Character` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "category",
DROP COLUMN "denomination",
ADD COLUMN     "bounty" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "crew" TEXT,
ADD COLUMN     "image" TEXT;
