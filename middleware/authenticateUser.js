const bcrypt = require('bcrypt');
const db = require('../models'); // Assuming models is the directory where your Sequelize models are
const { User } = db;

const authenticateUser = async (req, res, next) => {
    const auth = req.get('Authorization');

    if (auth) {
        const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('utf-8').split(':');
        const [email, password] = credentials;

        const user = await User.findOne({ where: { emailAddress: email }});


        if (user) {
            const authenticated = await bcrypt.compare(password, user.password);

            if (authenticated) {
                req.currentUser = user; // Add the user account to the Request object
                return next();
            }
        }
    }

    // Authentication failed
    return res.status(401).json({ message: 'Access Denied' });
};

module.exports = authenticateUser;
