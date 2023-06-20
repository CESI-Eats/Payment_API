import Payment from "../models/Payment";
import {MessageLapinou, handleTopic, initExchange, initQueue, sendMessage} from "../services/lapinouService";
import {acceptPayment} from "../services/toolsService";

export function createAllExchange() {
    initExchange('all').then(exchange => {
        initQueue(exchange, 'get.payments').then(({queue, topic}) => {
            handleTopic(queue, topic, async (msg) => {
                const message = msg.content as MessageLapinou;
                try {
                    console.log(` [x] Received message: ${JSON.stringify(message)}`);

                    const payments = await Payment.find();

                    await sendMessage({
                        success: true,
                        content: payments,
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
        initQueue(exchange, 'get.payment').then(({queue, topic}) => {
            handleTopic(queue, topic, async (msg) => {
                const message = msg.content as MessageLapinou;
                try {
                    console.log(` [x] Received message: ${JSON.stringify(message)}`);

                    const payment = await Payment.findById(message.content.id);

                    await sendMessage({
                        success: true,
                        content: payment,
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