import express from 'express';
import * as paymentController from '../controllers/paymentController';
import {authorize} from '../middlewares/authorizationMiddleware';
import {IdentityType} from '../enums/identityType';

const router = express.Router();

router.get('/', authorize([IdentityType.TECHNICAL, IdentityType.SALES]), paymentController.getAllPayments);
router.get('/:id', authorize([IdentityType.TECHNICAL, IdentityType.SALES]), paymentController.getPayment);
router.post('/', authorize([IdentityType.TECHNICAL, IdentityType.SALES, IdentityType.USER]), paymentController.createPayment);
router.put('/:id', authorize([IdentityType.TECHNICAL]), paymentController.updatePayment);
router.delete('/:id', authorize([IdentityType.TECHNICAL, IdentityType.SALES]), paymentController.deletePayment);
// Il manque une route pour payer du compte cesi vers les utilisateurs
export default router;
