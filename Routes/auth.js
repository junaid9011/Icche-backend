const express=require('express'); 
const router=express.Router();

const {register,
    login,
    logout,
    forgotPassword,
    getUserProfile,
    changePassword,
    updateUserProfile,
    allUsers,
    getuserDetails,
    updateUserProfileById,
    deleteUser
}=require('../controllers/userController');
const { isAuthenticatedUser,authorizedRule }=require('../Middleware/checkAuth')

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout)
router.route('/password/forgot').post(forgotPassword)
router.route('/me').get(isAuthenticatedUser ,getUserProfile)
router.route('/password/change').put(isAuthenticatedUser,changePassword)
router.route('/me/update').put(isAuthenticatedUser,updateUserProfile)
router.route('/admin/users').get(isAuthenticatedUser,authorizedRule('admin'),allUsers)
router.route('/admin/user/:id')
                                .get(isAuthenticatedUser,authorizedRule('admin'),getuserDetails)
                                .put(isAuthenticatedUser,authorizedRule('admin'),updateUserProfileById)
                                .delete(isAuthenticatedUser,authorizedRule('admin'),deleteUser)
module.exports = router;