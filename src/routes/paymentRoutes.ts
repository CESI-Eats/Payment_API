import express from 'express';
import * as paymentController from '../controllers/paymentController';
import {authorize} from '../middlewares/authorizationMiddleware';
import {IdentityType} from '../enums/identityType';

const router = express.Router();

router.get('/', authorize([IdentityType.TECHNICAL, IdentityType.SALES]), paymentController.getAllPayments);
router.get('/:id', authorize([IdentityType.TECHNICAL, IdentityType.SALES]), paymentController.getPayment);
router.post('/', authorize([IdentityType.TECHNICAL, IdentityType.SALES, IdentityType.USER]), (req, res) => paymentController.createPayment(req, res, "credit"));

router.post("/restorer/collect", authorize([IdentityType.TECHNICAL, IdentityType.SALES, IdentityType.RESTORER]), paymentController.collectKittyRestorer)
router.post("/deliveryman/collect", authorize([IdentityType.TECHNICAL, IdentityType.SALES, IdentityType.DELIVERYMAN]), paymentController.collectKittyDeliveryman)
export default router;
