/*
  Warnings:

  - Added the required column `description` to the `Wishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humidity` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "humidity" TEXT NOT NULL;
