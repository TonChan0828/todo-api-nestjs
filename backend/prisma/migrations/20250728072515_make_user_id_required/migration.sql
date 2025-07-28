/*
  Warnings:

  - Made the column `userId` on table `todos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "todos" ALTER COLUMN "userId" SET NOT NULL;
