import {Request, Response} from 'express';
import Payment from '../models/Payment';
import axios from 'axios';

// Get all
export const getAllPayments = async (req: Request, res: Response) => {
    try {
        console.log((req as any).identityId);
        const myModels = await Payment.find();
        res.status(200).json(myModels);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

// Get specific one
export const getPayment = async (req: Request, res: Response) => {
    try {
        const myModel = await Payment.findById(req.params.id);
        if (myModel == null) {
            return res.status(404).json({message: 'Cannot find Payment'});
        }
        res.status(200).json(myModel);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

// Create
export const createPayment = async (req: Request, res: Response, type: String) => {
    const payment = new Payment({
        _idIdentity: (req as any).identityId,
        type: type,
        amount: req.body.amount,
        mode: req.body.mode,
        status: "Pending",
    });
    try {
        const pendingPayment = await payment.save();
        payment.status = acceptPayment();
        const newPayment = await Payment.findByIdAndUpdate(pendingPayment.id, payment, {new: true});
        res.status(201).json(newPayment);
        return payment.status
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(400).json({message: errMessage});
    }
};

// Pay a deliveryman
export const collectKittyDeliveryman = async (req: Request, res: Response) => {
    await createPayment(req, res, "debit")
    // Request Account API to put deliveryman's kitty at 0
};

// Pay a restorer
export const collectKittyRestorer = async (req: Request, res: Response) => {
    try {
        // Create a payment with debit operation
        const payment = new Payment({
            _idIdentity: (req as any).identityId,
            type: "debit",
            amount: req.body.amount,
            mode: req.body.mode,
            status: "Pending",
        });
        const pendingPayment = await payment.save();
        payment.status = acceptPayment();
        const newPayment = await Payment.findByIdAndUpdate(pendingPayment.id, payment, {new: true});
        if (payment.status == "Success") {
            // Request Account API to set restorer's kitty to 0
            const accountApiUrl = (process.env.ACCOUNT_API_URI || "") + "/restorers/kitty/reset";

            const accountApiPayload = {
                type: "debit"
            };
            let response = await axios.post(accountApiUrl, accountApiPayload, {
                headers: {
                    Authorization: `${(req as any).headers.authorization}`
                }
            });
        }
        res.status(200).json(newPayment);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(400).json({message: errMessage});
    }
};

function acceptPayment(): string {
    const successChance = 0.8; // 80% chance of success
    const randomValue = Math.random();

    if (randomValue < successChance) {
        return "Success";
    } else {
        return "Failed";
    }
}