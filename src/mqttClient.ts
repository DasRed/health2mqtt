import mqtt from 'mqtt';
import config from './config';

export type MqttClient = mqtt.MqttClient & {
    publishH2M(topic: string, payload: any): Promise<void>;
};

const publishCache: Object = {};

async function publishH2M(client: mqtt.MqttClient, topic: string, payload: any): Promise<void> {
    topic   = `${config.mqtt.baseTopic}/${topic}`;
    payload = JSON.stringify(payload);

    if (publishCache[topic] !== payload) {
        await client.publishAsync(topic, payload, {retain: config.mqtt.retain});
        publishCache[topic] = payload;
    }
}

export default async function connect(): Promise<MqttClient> {
    const client = <MqttClient>await mqtt.connectAsync(config.mqtt.host, {
        username:        config.mqtt.user,
        password:        config.mqtt.password,
        keepalive:       config.mqtt.keepAlive,
        protocolVersion: config.mqtt.version,
        will:            {
            topic:   `${config.mqtt.baseTopic}/bridge/state`,
            payload: Buffer.from(JSON.stringify({state: 'offline'})),
            retain:  true,
        }
    });

    client.publishH2M = (topic: string, payload: any): Promise<void> => publishH2M(client, topic, payload);
    await client.publishH2M(`bridge/state`, {state: 'online'});

    return client;
}