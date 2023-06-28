import {connectLapinou} from './services/lapinouService';
import {createRestorerExchange} from './exchanges/restorerExchange';
import {createAllExchange} from "./exchanges/allExchange";
import {createDeliveryManExchange} from "./exchanges/deliverymanExchange";
import {createOrderingExchange} from "./exchanges/orderingExchange";

export function initLapinou() {
    connectLapinou().then(async () => {
        createAllExchange();
        createOrderingExchange();
        createRestorerExchange();
        createDeliveryManExchange();
    });
}
