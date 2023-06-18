import { connectLapinou } from "./services/lapinouService";

export function initLapinou(){
    connectLapinou().catch((err) => {
        console.error('Failed to connect to rabbitMQ');
      });
}