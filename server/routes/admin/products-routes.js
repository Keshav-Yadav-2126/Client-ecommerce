import express from 'express';
import { 
  handleImageUpload, 
  addProduct, 
  fetchAllProducts, 
  editProduct, 
  deleteProduct,
  getProductById 
} from '../../controllers/admin/products-controller.js';
import { upload } from '../../helpers/cloudinary.js';

const adminRouter = express.Router();

adminRouter.post('/upload-image', upload.single('my-file'), handleImageUpload);
adminRouter.post('/add', addProduct);
adminRouter.get('/get', fetchAllProducts);
adminRouter.get('/get/:id', getProductById); // New route for single product
adminRouter.put('/edit/:id', editProduct);
adminRouter.delete('/delete/:id', deleteProduct);

export default adminRouter;