const jwt = require('jsonwebtoken');
const config = require('config')

module.exports = (req, res, next) => {
    if (req.headers.authorization === undefined) {
        return res.status(401).send('Access Denied.No token provided.')
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access Denied.No token provided.')
    }
    try {
        const decodedRetailer = jwt.verify(token, config.get('jwtPrivateKey'));
        req.retailer = decodedRetailer;
        next();
    }
    catch (ex) {
        console.log('Error in decoding.', ex)
        res.status(400).send('Invalid token.');
    }
}