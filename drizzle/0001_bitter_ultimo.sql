CREATE TABLE "file" (
	"id" text PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"storage_key" text NOT NULL,
	"storage_url" text NOT NULL,
	"user_id" text NOT NULL,
	"summary" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;