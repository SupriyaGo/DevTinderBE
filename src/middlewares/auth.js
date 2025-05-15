export const adminAuth = (req, res, next) => {
    // Logic to check if the request is authorized
    // const token = req.body?.token;
    const token = 'admin-token';
    const isAuthorized = token ===  'admin-token' ;
    console.log('Authorized request from adminAuth middleware');
    if(isAuthorized) {
     next();
    }  else {
        res.status(401).send('Unauthorized request');
    }
}
export const userAuth = (req, res, next) => {
    console.log(req.url);

    // Do not require authentication for user login route
    const isUserLoginRoute = req.url === '/user/login'; 
    if(isUserLoginRoute) {
        console.log('User login route, no auth required');
        next();
        return;
    }
    
    // Logic to check if the request is authorized
    // const token = req.body?.token;
    const token = 'admin-token';
    const isAuthorized = token ===  'admin-token' ;
    console.log('Authorized request from userAuth middleware');
    if(isAuthorized) {
     next();
    }  else {
        res.status(401).send('Unauthorized request');
    }
}