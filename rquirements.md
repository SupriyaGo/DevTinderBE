HLD
---------
# Requirements
    1. Create an account
    2. Login
    3. Update your profile
    4. Feed Page - explore devs
    5. Send connection request / Ignore a request
    6. See our matches
    7. See the request we have send / received

# Tech Planning
    1. Microservices
        a. FE - React
        b. BE - Node Js
              - Mongo DB
    
LLD
---------
# DB Design
    ## Collections (Single responsibility principle)
        - User
            _ Firstname
            _ lastname
            _ Email
            _ Password
            _ Age
        - ConnectionRequest
            _ fromUserId
            _ toUserId
            _ status (pending / accepted / rejected || ignored / blocked)

# API Design (REST)
    - POST /signup
    - POST /login
    - GET /profile
    - POST /profile
    - PATCH /profile
    - DELETE /profile
    - POST /sendRequest
                    _ ignore
                    _ interested
    - POST /reviewRequest
                    _ accept
                    _ reject
    - GET /request
    - GET /connections
