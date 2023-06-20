import {connectLapinou} from './services/lapinouService';
import {createRestorerExchange} from './exchanges/restorerExchange';
import {createAllExchange} from "./exchanges/allExchange";
import {createDeliveryManExchange} from "./exchanges/deliverymanExchange";
import {createUserExchange} from "./exchanges/userExchange";

export function initLapinou() {
    connectLapinou().then(async () => {
        createAllExchange();
        createUserExchange();
        createRestorerExchange();
        createDeliveryManExchange();
    }).catch((err) => {
        console.error('Failed to connect to rabbitMQ');
    });
}
