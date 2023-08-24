const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  editUser,
  editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', editUser);
router.patch('/me/avatar', editUserAvatar);
module.exports = router;
