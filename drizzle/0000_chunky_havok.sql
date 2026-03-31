CREATE TABLE "daily_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"summary" text NOT NULL,
	"notable_events" jsonb,
	"generated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "daily_summaries_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"mmsi" text NOT NULL,
	"position" "GEOMETRY(Point, 4326)" NOT NULL,
	"speed" real,
	"heading" real,
	"course" real,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vessels" (
	"mmsi" text PRIMARY KEY NOT NULL,
	"name" text,
	"vessel_type" text,
	"flag" text,
	"length" real,
	"width" real,
	"destination" text,
	"first_seen" timestamp with time zone NOT NULL,
	"last_seen" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weather_readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"wind_speed" real,
	"wind_direction" real,
	"wave_height" real,
	"visibility" real,
	"temperature" real,
	"raw_data" jsonb
);
--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_mmsi_vessels_mmsi_fk" FOREIGN KEY ("mmsi") REFERENCES "public"."vessels"("mmsi") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_positions_timestamp" ON "positions" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_positions_mmsi" ON "positions" USING btree ("mmsi");--> statement-breakpoint
CREATE INDEX "idx_positions_geo" ON "positions" USING gist ("position");--> statement-breakpoint
CREATE INDEX "idx_weather_timestamp" ON "weather_readings" USING btree ("timestamp");