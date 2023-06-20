import { create } from 'domain';
import Payment from './models/Payment';
import { MessageLapinou, sendMessage, connectLapinou, handleTopic, initExchange, initQueue } from './services/lapinouService';
import { createRestorerExchange } from './exchanges/restorerExchange';

export function initLapinou(){
    connectLapinou().then(async () => {
      createRestorerExchange();
    }).catch((err) => {
        console.error('Failed to connect to rabbitMQ');
    });
}
