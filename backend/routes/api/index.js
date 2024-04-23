const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js');
const spotImageRouter = require('./spot-images.js');
const reviewRouter = require('./reviews.js');
const reviewImageRouter = require('./review-images.js');
// const { setTokenCookie } = require('../../utils/auth.js');
// const { requireAuth } = require('../../utils/auth.js');
// const { User } = require('../../db/models');

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotRouter);
router.use('/spot-images', spotImageRouter);
router.use('/reviews', reviewRouter);
router.use('/review-images', reviewImageRouter);

// POST /api/test
router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

// GET /
router.get('/', async (req, res, next) => {
    return res.status(200).json({message: 'Refer to API documentation for backend routes'});
});

// // GET /api/restore-user
// router.get('/restore-user', (req, res) => {
//     return res.json(req.user);
// });

// // GET /api/set-token-cookie
// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: 'Demo-lition'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user: user });
// });

// // GET /api/require-auth
// router.get('/require-auth', requireAuth, (req, res) => {
//     return res.json(req.user);
// });


module.exports = router;
