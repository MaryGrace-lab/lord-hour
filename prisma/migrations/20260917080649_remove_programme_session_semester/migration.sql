/*
  Warnings:

  - You are about to drop the column `programmeId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `creditUnits` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `programmeId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `semesterId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `programmeId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `AcademicSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Programme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Semester` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_programmeId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_programmeId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Semester" DROP CONSTRAINT "Semester_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_programmeId_fkey";

-- DropIndex
DROP INDEX "Course_code_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "programmeId";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "code",
DROP COLUMN "creditUnits",
DROP COLUMN "programmeId",
DROP COLUMN "semesterId",
DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "programmeId";

-- DropTable
DROP TABLE "AcademicSession";

-- DropTable
DROP TABLE "Programme";

-- DropTable
DROP TABLE "Semester";
