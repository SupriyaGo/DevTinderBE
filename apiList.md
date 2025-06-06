# DevTinder APIs

## authRouter
- POST /signup
- POST /signin
- POST /logout

## profileRouter
- GET   /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## requestRouter
- POST /request/send/ignore/:userId
- POST /request/send/interested/:userId
- POST /request/review/accepted/requestId
- POST /request/review/rejected/requestId

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you the proifles of other users on platform


Status: ignore, interested, accepted, rejected