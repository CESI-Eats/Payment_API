import * as amqp from 'amqplib/callback_api';

export interface MessageLapinou {
    success: boolean;
    content: any;
}

export const connectLapinou = async (queue: string): Promise<amqp.Channel> => {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.LAPINOU_URI as string, (error, conn) => {
            if (error) {
                reject(error);
            } else {
                conn.createChannel((error, chan) => {
                    if (error) {
                        reject(error);
                    } else {
                        chan.assertQueue(queue);
                        resolve(chan);
                    }
                });
            }
        });
    });
}

export async function sendMessage(
    message: MessageLapinou,
    sendQueue: string
  ): Promise<void> {
    const channel = await connectLapinou(sendQueue);
    channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(message)));
    console.log(`Sent message to ${sendQueue}`, message);
}

export async function receiveMessage<MessageLapinou>(
receiveQueue: string
): Promise<MessageLapinou> {
const channel = await connectLapinou(receiveQueue);
return new Promise<MessageLapinou>((resolve, reject) => {
    channel.consume(receiveQueue, (data) => {
    if (data && data.content) {
        console.log(`Received message from ${receiveQueue}`, data.content.toString());
        channel.ack(data);
        channel.close((err) => {
            if (err) {
                console.error('Error closing channel:', err);
            }
        });
        resolve(JSON.parse(data.content.toString()) as MessageLapinou);
    } else {
        reject(new Error(`Invalid data received from ${receiveQueue}`));
    }
    });
});
}



// import * as amqp from 'amqplib/callback_api';

// export interface MessageLapinou {
//     success: boolean;
//     content: any;
// }

// export const connectLapinou = (queue: string): Promise<amqp.Channel> => {
//     return new Promise((resolve) => {
//         amqp.connect(process.env.LAPINOU_URI as string, (error, connection) => {
//             connection.createChannel((error, channel) => {
//                 channel.assertQueue(queue)
//                 resolve(channel)
//             })
//         })
//     })
// }

// export async function sendMessage(
//     message: MessageLapinou,
//     sendQueue: string
//   ): Promise<void> {
//     const channel = await connectLapinou(sendQueue);
//     channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(message)));
//     console.log(`Sent message to ${sendQueue}`, message);
//     }
  
// export async function receiveMessage<MessageLapinou>(
// receiveQueue: string
// ): Promise<MessageLapinou> {
// const channel = await connectLapinou(receiveQueue);
// return new Promise<MessageLapinou>((resolve, reject) => {
//     channel.consume(receiveQueue, (data) => {
//     if (data && data.content) {
//         console.log(`Received message from ${receiveQueue}`, data.content.toString());
//         channel.ack(data);
//         resolve(JSON.parse(data.content.toString()) as MessageLapinou);
//     } else {
//         reject(new Error(`Invalid data received from ${receiveQueue}`));
//     }
//     });
// });
// }
  


// export async function sendMessageAndReceiveResponse<T>(
//     message: any,
//     sendQueue: string,
//     receiveQueue: string,
//   ): Promise<T> {
//     const channel = await connectLapinou(receiveQueue);
  
//     return new Promise<T>((resolve, reject) => {
//       channel.consume(receiveQueue, (data) => {
//         if (data && data.content) {
//           console.log(`Received message from ${receiveQueue}`, data.content.toString());
//           channel.ack(data as any);
//           resolve(JSON.parse(data.content.toString()) as T);
//         } else {
//           reject(new Error(`Invalid data received from ${receiveQueue}`));
//         }
//       });
  
//       channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(message)));
//       console.log(`Sent message to ${sendQueue}`, message);
//     });
//   }
  