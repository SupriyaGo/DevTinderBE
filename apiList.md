# DevTinder APIs

## authRouter
- POST /signup
- POST /signin
- POST /signout

## profileRouter
- GET   /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## requestRouter
- POST /request/send/:status/:userId
- POST /request/send/ignore/:userId
- POST /request/send/interested/:receiverId

- POST /request/review/accepted/requestId
- POST /request/review/rejected/requestId

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you the proifles of other users on platform


Status: ignored, interested, accepted, rejected