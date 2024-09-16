import {AutoHealthExport} from '../autoHealthExporterStruct';
import {MqttClient} from '../mqttClient';

export default async function (client: MqttClient, metric: AutoHealthExport.Metric): Promise<boolean> {
    const data = <AutoHealthExport.Value>metric.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).shift();
    if (data === undefined) {
        return true;
    }

    await client.publishH2M(`${metric.name}/current`, {
        value: data.qty,
        date:  new Date(data.date).toJSON(),
        unit:  metric.units
    });

    return true;
}