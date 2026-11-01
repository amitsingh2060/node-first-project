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
- GET /user/request/received
- GET /user/connection
- GET /user/feed - Gets you the profile of others


- Comapre query operators
/feed?page=1&limit=10 => 1-10
/feed?page=2&limit=10 => 11-20
/feed?page=3&limit=10 => 21-30

.skip(0) & .limit(10)

skip = (page-1) * limit (4-1) * 10