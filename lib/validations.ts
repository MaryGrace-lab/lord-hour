import { z } from "zod";

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

export function getFirstError(error: z.ZodError): string {
  return error.issues[0]?.message || "Invalid input";
}

export function validationError(error: z.ZodError): {
  success: false;
  error: string;
} {
  return { success: false, error: getFirstError(error) };
}

// ────────────────────────────────────────────────
// Primitives
// ────────────────────────────────────────────────

const username = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username is too long")
  .regex(
    /^[a-z0-9._-]+$/,
    "Username can only contain letters, numbers, dots, underscores, and hyphens"
  );

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address")
  .max(200, "Email is too long");

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address")
  .max(200)
  .optional()
  .or(z.literal("").transform(() => undefined));

const phone = z
  .string()
  .trim()
  .min(7, "Phone number is too short")
  .max(30, "Phone number is too long");

const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .optional()
  .or(z.literal("").transform(() => undefined));

const shortText = (label: string, max = 100) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} is too long`);

const optionalShortText = (max = 100) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

const longText = (max = 5000) =>
  z
    .string()
    .trim()
    .max(max, "Text is too long")
    .optional()
    .or(z.literal("").transform(() => undefined));

const cuid = z.string().trim().cuid("Invalid ID");

const optionalCuid = z
  .string()
  .trim()
  .cuid()
  .optional()
  .or(z.literal("").transform(() => undefined));

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const simplePassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long");

const positiveInt = (label: string, min = 1, max = 10000) =>
  z.coerce
    .number()
    .int(`${label} must be a whole number`)
    .min(min, `${label} must be at least ${min}`)
    .max(max, `${label} cannot exceed ${max}`);

// ────────────────────────────────────────────────
// PUBLIC — Application form
// ────────────────────────────────────────────────

export const applicationSchema = z.object({
  fullName: shortText("Full name", 100),
  email,
  phone,
  courseId: optionalCuid,
  notes: longText(2000),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// ────────────────────────────────────────────────
// PUBLIC — Account activation
// ────────────────────────────────────────────────

// The token is 32 random bytes rendered as 64 hex characters.
export const activationSchema = z
  .object({
    token: z.string().trim().length(64, "Invalid activation link"),
    password: strongPassword,
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

// ────────────────────────────────────────────────
// Admin — Students
// ────────────────────────────────────────────────

export const createStudentSchema = z.object({
  username,
  password: simplePassword.optional(),
  firstName: shortText("First name", 50),
  lastName: optionalShortText(50),
  studentId: shortText("Student ID", 30),
  email: optionalEmail,
  phone: optionalPhone,
  applicationId: optionalCuid,
  sendActivation: z.coerce.boolean(),
});

export const updateStudentSchema = z.object({
  userId: cuid,
  firstName: optionalShortText(50),
  lastName: optionalShortText(50),
  studentId: shortText("Student ID", 30),
  email: optionalEmail,
  phone: optionalPhone,
});

// ────────────────────────────────────────────────
// Admin — Teachers
// ────────────────────────────────────────────────

export const createTeacherSchema = z.object({
  username,
  password: simplePassword,
  firstName: optionalShortText(50),
  lastName: optionalShortText(50),
  staffId: optionalShortText(30),
});

export const updateTeacherSchema = z.object({
  userId: cuid,
  firstName: optionalShortText(50),
  lastName: optionalShortText(50),
  staffId: optionalShortText(30),
});

// ────────────────────────────────────────────────
// Admin — Courses & assignments
// ────────────────────────────────────────────────

export const createCourseSchema = z.object({
  title: shortText("Course title", 200),
  description: longText(2000),
});

export const assignTeacherSchema = z.object({
  courseId: cuid,
  teacherId: cuid,
});

export const enrollStudentSchema = z.object({
  studentId: cuid,
  courseId: cuid,
});

export const updateAdminProfileSchema = z.object({
  firstName: optionalShortText(50),
  lastName: optionalShortText(50),
});

// ────────────────────────────────────────────────
// Teacher — Modules, lessons, assignments, quizzes
// ────────────────────────────────────────────────

export const addModuleSchema = z.object({
  courseId: cuid,
  title: shortText("Module title", 200),
});

export const createLessonSchema = z.object({
  courseId: cuid,
  moduleId: cuid,
  title: shortText("Lesson title", 200),
  content: longText(50000),
});

export const updateLessonSchema = z.object({
  lessonId: cuid,
  title: shortText("Lesson title", 200),
  content: longText(50000),
});

export const createAssignmentSchema = z.object({
  courseId: cuid,
  title: shortText("Assignment title", 200),
  description: longText(5000),
  dueDate: z
    .string()
    .trim()
    .refine((v) => !isNaN(Date.parse(v)), "Invalid due date"),
  maxScore: positiveInt("Maximum score", 1, 1000),
});

export const gradeSubmissionSchema = z.object({
  submissionId: cuid,
  score: positiveInt("Score", 0, 1000),
  feedback: longText(2000),
});

export const createQuizSchema = z.object({
  courseId: cuid,
  title: shortText("Quiz title", 200),
  description: longText(2000),
  durationMinutes: positiveInt("Duration", 1, 600),
  passingScore: positiveInt("Passing score", 0, 100),
});

export const addQuizQuestionSchema = z.object({
  quizId: cuid,
  questionText: shortText("Question text", 2000),
  questionType: z
    .enum(["multiple_choice", "true_false", "short_answer"])
    .default("multiple_choice"),
  marks: positiveInt("Marks", 1, 100),
  options: longText(5000),
  correctAnswer: shortText("Correct answer", 500),
});

// ────────────────────────────────────────────────
// Student — Submissions & quiz attempts
// ────────────────────────────────────────────────

export const submitAssignmentSchema = z.object({
  assignmentId: cuid,
  content: longText(10000),
  fileUrl: z
    .string()
    .trim()
    .url("File URL must be a valid URL")
    .max(2000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export const submitQuizSchema = z.object({
  quizId: cuid,
});


// ────────────────────────────────────────────────
// ID-only operations
// ────────────────────────────────────────────────

export const idOnlySchema = z.object({
  id: cuid,
});

export const userIdSchema = z.object({
  userId: cuid,
});

export const courseIdSchema = z.object({
  courseId: cuid,
});

export const removeTeacherSchema = z.object({
  courseId: cuid,
  teacherId: cuid,
});

export const removeEnrollmentSchema = z.object({
  enrollmentId: cuid,
});

// ────────────────────────────────────────────────
// Public — Testimony submission
// ────────────────────────────────────────────────

export const TESTIMONY_CATEGORIES = [
  "Healing",
  "Provision",
  "Restoration",
  "Breakthrough",
  "Salvation",
  "Protection",
  "Guidance",
  "Family",
  "Career",
  "Other",
] as const;

export const submitTestimonySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(100, "Name is too long"),
  email: optionalEmail,
  location: z
    .string()
    .trim()
    .max(100, "Location is too long")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  category: z.enum(TESTIMONY_CATEGORIES, {
    message: "Please select a category",
  }),
  content: z
    .string()
    .trim()
    .min(
      30,
      "Please write at least 30 characters so we can understand your testimony"
    )
    .max(3000, "Testimony is too long (max 3000 characters)"),
  anonymous: z.coerce.boolean(),
});

// ────────────────────────────────────────────────
// Teacher — Material upload metadata
// ────────────────────────────────────────────────

export const recordMaterialSchema = z.object({
  lessonId: cuid,
  title: z.string().trim().min(1).max(200),
  fileUrl: z
    .string()
    .trim()
    .url()
    .max(2000)
    .refine(
      (u) => u.startsWith("https://res.cloudinary.com/"),
      "File URL must be hosted on Cloudinary"
    ),
  type: z.enum([
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "png",
    "jpg",
    "jpeg",
    "txt",
  ]),
});