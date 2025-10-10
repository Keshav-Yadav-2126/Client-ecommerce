// routes/shop/review-routes.js
import express from 'express';
import {
  getReviews,
  addReview,
  canReview,
  getAllReviews,
  approveReview,
  toggleReviewVisibility,
  deleteReview,
  getApprovedReviewsForHomepage
} from '../../controllers/shop/review-controller.js';

const router = express.Router();

// Shop routes (for customers)
router.get('/:productId', getReviews);
router.get('/get/all', getApprovedReviewsForHomepage);
router.post('/add', addReview);
router.get('/can-review/:productId/:userId', canReview);

// Admin routes (for admin panel)
router.get('/admin/all', getAllReviews);
router.put('/admin/approve/:id', approveReview);
router.put('/admin/toggle/:id', toggleReviewVisibility);
router.delete('/admin/delete/:id', deleteReview);

export default router;