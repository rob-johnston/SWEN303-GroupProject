CREATE TABLE `ListingColour` (
	`ListingKey`	INTEGER,
	`ColourKey`	INTEGER,
	PRIMARY KEY(ListingKey,ColourKey),
	FOREIGN KEY(ListingKey) REFERENCES Listing(ListingKey)
	FOREIGN KEY(ColourKey) REFERENCES Colour(ColourKey)
)