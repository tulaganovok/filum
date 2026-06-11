CREATE TYPE "public"."department" AS ENUM('IT', 'HR', 'Accounting', 'Other');--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "department" "department";