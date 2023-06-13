import { Request, Response } from 'express';
import Payment from '../models/Payment';


// Get all
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    console.log((req as any).identityId);
    const myModels = await Payment.find();
    res.status(200).json(myModels);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Get specific one
export const getPayment = async (req: Request, res: Response) => {
  try {
    const myModel = await Payment.findById(req.params.id);
    if (myModel == null) {
      return res.status(404).json({ message: 'Cannot find myModel' });
    }
    res.status(200).json(myModel);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Create
export const createPayment = async (req: Request, res: Response,type: String) => {
  const payment = new Payment({
    _idIdentity: (req as any).identityId,
    type: type,
    amount: req.body.amount,
    date: req.body.date,
    mode: req.body.mode,
    status: "pending",
  });
  try {
    const pendingPayment = await payment.save();
    payment.status = acceptPayment();
    const newPayment = await Payment.findByIdAndUpdate(pendingPayment.id, payment, { new: true });
    res.status(201).json(newPayment);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};

// Update
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const updatedMyModel = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMyModel);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};

// Delete
export const deletePayment = async (req: Request, res: Response) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'MyModel deleted' });
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Pay a deliveryman
export const payDeliveryman = async (req: Request, res: Response) => {
    await createPayment(req, res, "debit")
    // Request Account API to put deliveryman's kitty at 0
};

// Pay a restorer
export const payRestorer = async (req: Request, res: Response) => {
  await createPayment(req, res, "debit")
  // Request Account API to put restorer's kitty at 0
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