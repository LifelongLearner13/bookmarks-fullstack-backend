DROP TABLE IF EXISTS "bookmark_tags";
DROP TABLE IF EXISTS "tag";
DROP TABLE IF EXISTS "bookmark";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "folder";

CREATE TABLE "folder"(
  fr_foldername VARCHAR(20),
  PRIMARY KEY (fr_foldername)
);

CREATE TABLE "user"(
  us_userid SERIAL PRIMARY KEY,
  us_username VARCHAR(12) NOT NULL DEFAULT '',
  us_password VARCHAR(40) NOT NULL,
  us_salt VARCHAR(100) NOT NULL DEFAULT '',
  UNIQUE(us_username)
);

CREATE TABLE "bookmark"(
  bk_url VARCHAR(100) NOT NULL,
  bk_title VARCHAR(100) NOT NULL,
  bk_description TEXT DEFAULT '',
  bk_foldername VARCHAR(20) REFERENCES "folder" (fr_folderName),
  bk_screenshot VARCHAR(100) DEFAULT 'http://placekitten.com/200/300',
  bk_bookmarkid SERIAL PRIMARY KEY,
  bk_userid INTEGER REFERENCES "user" (us_userid)
);

CREATE TABLE "tag"(
  tg_tagid SERIAL PRIMARY KEY,
  tg_tag VARCHAR(50) NOT NULL
);

CREATE TABLE "bookmark_tags"(
  bt_bookmarkid INTEGER REFERENCES "bookmark" (bk_bookmarkid),
  bt_tagid INTEGER REFERENCES "tag" (tg_tagid),
  PRIMARY KEY (bt_bookmarkid, bt_tagid)
);

