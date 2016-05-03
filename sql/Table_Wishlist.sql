CREATE TABLE "Wishlist" (
	`ListingKey`	INTEGER,
	`UserKey`	INTEGER,
	PRIMARY KEY(ListingKey,UserKey)
	FOREIGN KEY(ListingKey) REFERENCES Listing(ListingKey)
	FOREIGN KEY(UserKey) REFERENCES User(UserKey)
)