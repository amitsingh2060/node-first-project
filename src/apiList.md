authRouter
-  POST /signup
-  POST /login
-  POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID

userRouter
- GET /user/connection
- GET /user/request/received
- GET /user/feed - Gets you the profile of others

