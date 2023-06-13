﻿import express from 'express';
import * as paymentController from '../controllers/paymentController';
import {authorize} from '../middlewares/authorizationMiddleware';
import {IdentityType} from '../enums/identityType';

const router = express.Router();

router.get('/', authorize([IdentityType.TECHNICAL, IdentityType.SALES]), paymentController.getAllPayments);
router.get('/:id', authorize([IdentityType.TECHNICAL, IdentityType.SALES]), paymentController.getPayment);
router.post('/', authorize([IdentityType.TECHNICAL, IdentityType.SALES, IdentityType.USER]), (req, res) => paymentController.createPayment(req, res, "credit"));
router.put('/:id', authorize([IdentityType.TECHNICAL]), paymentController.updatePayment);
router.delete('/:id', authorize([IdentityType.TECHNICAL, IdentityType.SALES]), paymentController.deletePayment);

router.post("/paydeliveryman", authorize([IdentityType.TECHNICAL, IdentityType.SALES, IdentityType.DELIVERYMAN]), paymentController.collectKittyDeliveryman)
router.post("/payrestorer", authorize([IdentityType.TECHNICAL, IdentityType.SALES, IdentityType.RESTORER]), paymentController.collectKittyRestorer)
export default router;
