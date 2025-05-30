-- First, clean up any existing FTS objects to avoid conflicts
DROP TRIGGER IF EXISTS trigger_posts_fts ON posts;
DROP FUNCTION IF EXISTS posts_fts_trigger();
DROP INDEX IF EXISTS idx_posts_fts;

-- 1. Add the FTS column to Post table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'fts'
    ) THEN
        ALTER TABLE "posts" ADD COLUMN fts tsvector;
    END IF;
END $$;

-- 2. Populate initial FTS data for existing posts
UPDATE "posts"
SET fts = to_tsvector('english', coalesce(title, ''));

-- 3. Create GIN index on FTS column
CREATE INDEX idx_posts_fts ON "posts" USING GIN (fts);

-- 4. Create the trigger function to update fts on insert/update
CREATE FUNCTION posts_fts_trigger() RETURNS trigger AS $$
BEGIN
  NEW.fts := to_tsvector('english', coalesce(NEW.title, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 5. Attach trigger to the posts table
CREATE TRIGGER trigger_posts_fts
BEFORE INSERT OR UPDATE ON "posts"
FOR EACH ROW EXECUTE FUNCTION posts_fts_trigger();