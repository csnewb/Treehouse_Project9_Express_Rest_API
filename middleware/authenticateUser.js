const bcrypt = require('bcrypt');
const db = require('../models'); // Assuming models is the directory where your Sequelize models are
const { User } = db;

const authenticateUser = async (req, res, next) => {
    const auth = req.get('Authorization');
    console.log(`auth: ${auth}`);

    if (auth && auth.startsWith('Basic ')) {  // Ensure it has 'Basic ' prefix for consistency
        const credentials = auth.slice(6).split(':'); // Skip the 'Basic ' prefix and split on colon
        const [email, password] = credentials;

        console.log(`credentials: ${credentials}`);
        console.log(`email: ${email}`);
        console.log(`password: ${password}`);

        const user = await User.findOne({ where: { emailAddress: email }});

        if (user) {
            await console.log(`user: ${user.firstName}`)
            const authenticated = await bcrypt.compare(password, user.password);
            console.log(authenticated)

            if (authenticated) {
                req.currentUser = user; // Add the user account to the Request object
                console.log(`user: ${user.firstName} is Authenticated`)
                return next();
            }
        }
    }

    // Authentication failed
    return res.status(401).json({ message: 'Access Denied' });
};


// const authenticateUser2 = async (req, res, next) => {
//     console.log(`req: ${req}`)
//     const auth = req.get('Authorization');
//     console.log(`auth: ${auth}`)
//
//     if (auth) {
//         console.log(`Auth True`)
//         const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('utf-8').split(':');
//         const [email, password] = credentials;
//
//         console.log(`credentials: ${credentials}`)
//         console.log(`email: ${email}`)
//         console.log(`password: ${password}`)
//
//         const user = await User.findOne({ where: { emailAddress: email }});
//
//
//         if (user) {
//             const authenticated = await bcrypt.compare(password, user.password);
//
//             if (authenticated) {
//                 req.currentUser = user; // Add the user account to the Request object
//                 return next();
//             }
//         }
//     }
//
//     // Authentication failed
//     return res.status(401).json({ message: 'Access Denied' });
// };

module.exports = authenticateUser;
