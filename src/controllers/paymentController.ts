import {Request, Response, response} from 'express';
import Payment from '../models/Payment';
import { MessageLapinou, receiveMessage, sendMessage } from '../services/lapinouService';

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
    
    const sendQueue = 'reset-restorer-kitty-payment';
    const receiveQueue = 'reset-restorer-kitty-account';

    if (payment.status == "Success") {
        sendMessage({success: true, content: (req as any).identityId} as MessageLapinou, sendQueue)
        
        receiveMessage(receiveQueue)
            .then((data) => {
                (data as MessageLapinou).success ? res.status(200).json(newPayment) : res.status(500).json({message: "An error occurred"});
            })
            .catch((error) => {
                console.error('Error occurred while sending a message:', error);
                res.status(500).json({message: error});
                });
    }else{
        res.status(500).json({message: "An error occurred, payment failed"});
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