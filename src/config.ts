import 'dotenv/config';

export type Config = {
    mqtt: {
        host: string;
        user: string;
        password: string;
        baseTopic: string;
        keepAlive: number;
        version: 4 | 5 | 3;
        retain: boolean;
    };

    server: {
        port: number;
    };
};

export default <Config>{
    mqtt: {
        host:      process.env.H2M_MQTT_HOST,
        user:      process.env.H2M_MQTT_USER,
        password:  process.env.H2M_MQTT_PASSWORD,
        baseTopic: process.env.H2M_MQTT_BASE_TOPIC ?? 'health2mqtt',
        keepAlive: Number(process.env.H2M_MQTT_KEEPALIVE ?? 60),
        version:   Number(process.env.H2M_MQTT_VERSION ?? 4),
        retain:    Boolean(process.env.H2M_MQTT_RETAIN ?? true),
    },
    server: {
        port:   Number(process.env.H2M_SERVER_PORT ?? 7870),
    }
};