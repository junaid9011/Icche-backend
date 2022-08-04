const express=require('express');
const router=express.Router();

const {newOrder,getSingleOrder,myOrders, allOrders,processOrder,deleteOrder}=require('../controllers/orderController');
const {isAuthenticatedUser,authorizedRule}=require('../Middleware/checkAuth');



router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
                          .delete(isAuthenticatedUser,authorizedRule('admin'),deleteOrder);
router.route('/orders/:user').get(isAuthenticatedUser,myOrders);
router.route('/admin/orders').get(isAuthenticatedUser,authorizedRule('admin'),allOrders);
router.route('/admin/order/update/:id').put(isAuthenticatedUser,authorizedRule('admin'),processOrder);
router.route('/admin/order/delete/:id').delete(isAuthenticatedUser,authorizedRule('admin'),deleteOrder);


module.exports = router;