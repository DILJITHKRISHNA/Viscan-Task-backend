/*
  Warnings:

  - A unique constraint covering the columns `[place]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_place_key" ON "Wishlist"("place");
