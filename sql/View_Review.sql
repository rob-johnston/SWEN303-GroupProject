CREATE VIEW VReview AS
SELECT 
Review.ReviewKey,
Review.SellerKey, 
Review.ReviewUser,
Review.ReviewDesc,
Review.ReviewRating,
User.UserDisplayName AS ReviewUserName,
User.UserPicture AS ReviewUserPicture
FROM Review 
JOIN User ON Review.ReviewUser = User.UserKey