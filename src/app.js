const express = require('express');
const app = express();

const {adminAuth, userAuth} = require('./middlewares/auth')

app.use("/test",[(req, res, next) => {
    console.log('handler 1');
    
    // res.send('Hello, from handler 1!');
    next()
},
(req, res, next) => {
    console.log('handler 2');
    res.send('Hello, from handler 2!');
    next()  
    
}],
(req, res) => {
    console.log('handler 3');

    res.send('Hello, from handler 3!');
})

// OUTPUT
// Server is running on port 3000
// handler 1
// handler 2
// Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
//     at ServerResponse.setHeader (node:_http_outgoing:699:11)
//     at ServerResponse.header (/Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/node_modules/express/lib/response.js:684:10)
//     at ServerResponse.send (/Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/node_modules/express/lib/response.js:161:12)
//     at /Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/src/app.js:8:9
//     at Layer.handleRequest (/Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/node_modules/router/lib/layer.js:152:17)
//     at trimPrefix (/Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/node_modules/router/index.js:342:13)
//     at /Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/node_modules/router/index.js:297:9
//     at processParams (/Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/node_modules/router/index.js:582:12)
//     at next (/Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/node_modules/router/index.js:291:5)
//     at Function.handle (/Users/supriyagorai/Supriya/NODEJS/DevTinder/Backend/node_modules/router/index.js:186:3)

// Authenticated routes

// app.get('/admin/getAllUser', (req, res) => {
//     // Logic to check if the request is authorized
//     // const token = req.body?.token;
//     // const isAuthorized = token === 'admin-token';
//     if(isAuthorized) {
//         res.send('Hello, from admin route!');
//     } else {
//         res.status(401).send('Unauthorized request');
//     }
// })

// app.delete('/admin/deleteUser', (req, res) => {
//     // Logic to check if the request is authorized
//     // const token = req.body?.token;
//     // const isAuthorized = token === 'admin-token';
//     if(isAuthorized) {
//         res.send('Deleted a user');
//     } else {
//         res.status(401).send('Unauthorized request');
//     }
// })

// auth middleware for all GET, POST, DELETE, PATCH, PUT requests
app.use('/admin', adminAuth)
// app.use('/user', userAuth)

app.get('/admin/getAllUser', (req, res) => {
    res.send('Hello, from admin route!');
})

// It will not authorize the request
app.get('/user', userAuth,(req, res) => {
    res.send('Hello, from user route!!');
})

app.get('/user/login', userAuth,(req, res) => {
    res.send('Hello, from user/login route!!');
})

app.use('/', (req, res, next) => {

})

// Error handling

// Best way is to use try-catch block
app.get('getUsersData', (req, res) => {
    try {
        res.send('Hello, from getUsersData route!');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

// To handle unwanted errors use this and put it at the end of the file
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Internal server error');
});


app.listen(3000, () => console.log('Server is running on port 3000'));