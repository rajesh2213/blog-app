-- Drop trigger if exists
DROP TRIGGER IF EXISTS posts_fts_trigger ON posts;

-- Drop trigger function if exists
DROP FUNCTION IF EXISTS posts_fts_trigger();

-- Drop the search configuration if exists
DROP TEXT SEARCH CONFIGURATION IF EXISTS blog_search;

-- Drop the search dictionary if exists
DROP TEXT SEARCH DICTIONARY IF EXISTS blog_dict;
