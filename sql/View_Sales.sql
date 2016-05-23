DROP VIEW VSales;

CREATE VIEW VSales AS 
SELECT Sales.SaleKey,
Sales.ListingKey,
Sales.ColourKey,
Sales.BuyerKey,
Listing.SellerKey,
b.UserName AS Buyer,
a.UserName AS Seller,
Colour.ColourName,
Listing.ListingPrice,
Listing.ListingTitle,
Listing.ListingDesc,
Listing.ListingImage
FROM Sales
INNER JOIN Listing ON Sales.ListingKey = Listing.ListingKey
INNER JOIN Colour ON Sales.ColourKey = Colour.ColourKey
INNER JOIN User a ON Listing.SellerKey = a.UserKey
INNER JOIN User b ON Sales.BuyerKey = b.UserKey
