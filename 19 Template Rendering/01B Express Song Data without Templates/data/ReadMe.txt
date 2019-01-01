Notes:
db_1200iRealSongs is an SQLite database with the following schema:

CREATE TABLE songs(
id integer primary key not null, --auto increment key
title text NOT NULL, --title of the song
composer text NOT NULL, --composer of the song
key text NOT NULL, --key of the song
bars text NOT NULL --bars of the song in standard music notation
);

CREATE TABLE users (
   userid TEXT PRIMARY KEY,
   password TEXT);


SQLite website: https://www.sqlite.org/index.html
