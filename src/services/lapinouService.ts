import * as amqp from 'amqplib/callback_api';

// export const connectLapinou = (url: string): Promise<amqp.Channel> => {
//     return new Promise((resolve, reject) => {
//         amqp.connect(url, (err, conn) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 conn.createChannel((err, ch) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(ch);
//                     }
//                 });
//             }
//         });
//     });
// }

export const connectLapinou = (url: string): Promise<amqp.Channel> => {
    return new Promise((resolve) => {
        amqp.connect(url, (error, connection) => {
            connection.createChannel((error, channel) => {
                channel.assertQueue("reset-restorer-kitty-account")
                resolve(channel)
            })
        })
    })
}