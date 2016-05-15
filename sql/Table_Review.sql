CREATE TABLE Review (
	'ReviewKey' INTEGER PRIMARY KEY AUTOINCREMENT,
	'ListingKey' INTEGER NOT NULL,
	'ReviewUser' INTEGER,
	'ReviewDesc' TEXT NOT NULL,
	'ReviewRating' INTEGER CHECK (ReviewRating > 0 AND ReviewRating <= 5),
	FOREIGN KEY("ListingKey") REFERENCES Listing(ListingKey),
	FOREIGN KEY("ReviewUser") REFERENCES User(UserKey)
)