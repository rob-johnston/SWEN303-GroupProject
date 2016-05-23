CREATE TABLE Sales (
SaleKey INTEGER PRIMARY KEY AUTOINCREMENT,
ListingKey INTEGER,
ColourKey INTEGER,
BuyerKey INTEGER,
FOREIGN KEY('ListingKey') REFERENCES ListingColour('ListingKey')
FOREIGN KEY('ColourKey') REFERENCES ListingColour('ColourKey')
FOREIGN KEY('BuyerKey') REFERENCES User('UserKey')
)