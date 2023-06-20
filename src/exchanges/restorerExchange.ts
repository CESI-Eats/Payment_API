import Payment from "../models/Payment";
import { MessageLapinou, handleTopic, initExchange, initQueue, sendMessage } from "../services/lapinouService";

export function createRestorerExchange() {
    initExchange('restorers').then(exchange => {
        initQueue(exchange, 'collect.restorer.kitty').then(({queue, topic}) => {
            handleTopic(queue, topic, async (msg) => {
                const message = msg.content as MessageLapinou;
                try {
                console.log(` [x] Received message: ${JSON.stringify(message)}`);
                    
                const payment = new Payment({
                    _idIdentity: message.content.id,
                    type: "debit",
                    amount: message.content.amount,
                    mode: message.content.mode,
                    status: "Pending",
                });
                const pendingPayment = await payment.save();
                payment.status = acceptPayment();
                await Payment.findByIdAndUpdate(pendingPayment.id, payment, {new: true});

                if (payment.status != "Success") {
                    throw new Error("Payment failed");
                }
                    
                await sendMessage({success: true, content: payment.status, correlationId: message.correlationId, sender: 'payment'}, message.replyTo??'');
                } catch (err) {
                    const errMessage = err instanceof Error ? err.message : 'An error occurred';
                    await sendMessage({success: false, content: errMessage, correlationId: message.correlationId, sender: 'payment'}, message.replyTo??'');
                }
            });
        });
    });
}

function acceptPayment(): string {
    const successChance = 0.8; // 80% chance of success
    const randomValue = Math.random();
  
    if (randomValue < successChance) {
        return "Success";
    } else {
        return "Failed";
    }
  }