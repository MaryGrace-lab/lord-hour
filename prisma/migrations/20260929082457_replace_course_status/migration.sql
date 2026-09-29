-- Add isPublished column, default false during migration so we can map values.
ALTER TABLE "Course" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- Map existing PUBLISHED courses to isPublished = true.
UPDATE "Course" SET "isPublished" = true WHERE "status" = 'PUBLISHED';

-- Delete ARCHIVED courses (cascades their enrollments, modules, lessons,
-- materials, assignments, submissions, quizzes, questions, attempts,
-- announcements). Applications referencing these courses have courseId set
-- to NULL via onDelete: SetNull.
DELETE FROM "Course" WHERE "status" = 'ARCHIVED';

-- New rows default to published.
ALTER TABLE "Course" ALTER COLUMN "isPublished" SET DEFAULT true;

-- Drop the old status column and its enum.
ALTER TABLE "Course" DROP COLUMN "status";
DROP TYPE "CourseStatus";