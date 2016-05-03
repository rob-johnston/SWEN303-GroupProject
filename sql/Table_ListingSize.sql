CREATE TABLE `ListingSize` (
	`ListingKey`	INTEGER,
	`SizeKey`	INTEGER,
	PRIMARY KEY(ListingKey,SizeKey)
	FOREIGN KEY(ListingKey) REFERENCES Listing(ListingKey)
	FOREIGN KEY(SIzeKey) REFERENCES Size(SizeKey)
)