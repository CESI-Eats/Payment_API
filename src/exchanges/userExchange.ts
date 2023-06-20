import Payment from "../models/Payment";
import {MessageLapinou, handleTopic, initExchange, initQueue, sendMessage} from "../services/lapinouService";
import {acceptPayment} from "../services/toolsService";

export function createUserExchange() {
    initExchange('users').then(exchange => {
        initQueue(exchange, 'create.payment').then(({queue, topic}) => {
            handleTopic(queue, topic, async (msg) => {
                const message = msg.content as MessageLapinou;
                try {
                    console.log(` [x] Received message: ${JSON.stringify(message)}`);

                    const payment = new Payment({
                        _idIdentity: message.content.id,
                        type: "credit",
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

                    await sendMessage({
                        success: true,
                        content: "Payment success",
                        correlationId: message.correlationId,
                        sender: 'payment'
                    }, message.replyTo ?? '');
                } catch (err) {
                    const errMessage = err instanceof Error ? err.message : 'An error occurred';
                    await sendMessage({
                        success: false,
                        content: errMessage,
                        correlationId: message.correlationId,
                        sender: 'payment'
                    }, message.replyTo ?? '');
                }
            })
        });
    })
}