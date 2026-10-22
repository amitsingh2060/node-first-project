### authRouter
-  POST /signup
-  POST /login
-  POST /logout

### profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
### dynamic - POST /request/send/:status/:userId
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

### dynamic - POST /request/review/:status/:userId
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID

### userRouter
- GET /user/connection
- GET /user/request/received
- GET /user/feed - Gets you the profile of others

