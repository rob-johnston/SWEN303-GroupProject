CREATE VIEW VListing AS
SELECT ListingKey,
SellerKey,
Listing.TypeKey,
UserName AS 'Seller',
TypeName,
ListingTitle,
ListingDesc,
ListingPrice,
ListingImage,
isDeleted
FROM Listing
LEFT JOIN User
LEFT JOIN Type