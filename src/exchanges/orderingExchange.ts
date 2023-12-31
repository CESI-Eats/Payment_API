import Payment from "../models/Payment";
import {MessageLapinou, handleTopic, initExchange, initQueue, publishTopic, sendMessage} from "../services/lapinouService";
import {acceptPayment} from "../services/toolsService";

export function createOrderingExchange() {
    initExchange('ordering').then(exchange => {
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

                    const socketMessage : MessageLapinou = {
                        success: true,
                        content: {
                            topic: 'payment.created',
                            message: payment,
                            ids: ["all"]
                        }
                    };
                    await publishTopic('notifications', 'send.websocket', socketMessage);

                    await sendMessage({
                        success: true,
                        content: {id: payment._id},
                        correlationId: message.correlationId,
                        sender: 'payment'
                    } as MessageLapinou, message.replyTo ?? '');
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