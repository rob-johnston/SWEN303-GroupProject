CREATE TABLE "Listing" (
	`ListingKey`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`SellerKey`	INTEGER NOT NULL,
	`TypeKey`	INTEGER NOT NULL,
	`ListingTitle`	TEXT NOT NULL,
	`ListingDesc`	TEXT,
	`ListingPrice`	REAL NOT NULL,
	`ListingImage`	TEXT,
	'isDeleted' INTEGER DEFAULT 0,
	FOREIGN KEY(SellerKey) REFERENCES User(UserKey)
	FOREIGN KEY(TypeKey) REFERENCES Type(TypeKey)
);