const express=require('express'); 
const router=express.Router();

const {getProducts,newProduct,getSingleProduct,updateProduct,removeProduct, createProductReview, getProductReviews, deleteReview}=require('../controllers/productController');
const {isAuthenticatedUser,authorizedRule}=require('../Middleware/checkAuth')
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/product/new').post(isAuthenticatedUser,authorizedRule('admin'),newProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizedRule('admin'),updateProduct).delete(isAuthenticatedUser ,authorizedRule('admin'),removeProduct);//update ar delete are in same route so added in one line

router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(isAuthenticatedUser,getProductReviews)
                        .delete(isAuthenticatedUser,deleteReview)
                        
module.exports=router;