CREATE TYPE "public"."status" AS ENUM('draft', 'saved', 'archived');--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "status" "status" DEFAULT 'draft';