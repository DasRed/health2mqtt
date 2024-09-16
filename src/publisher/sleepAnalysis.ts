import {AutoHealthExport} from '../autoHealthExporterStruct';
import {MqttClient} from '../mqttClient';

export default async function (client: MqttClient, metric: AutoHealthExport.Metric): Promise<boolean> {
    const data = <AutoHealthExport.SleepAnalysis>metric.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).shift();
    if (data === undefined) {
        return true;
    }

    await client.publishH2M(`${metric.name}/current`, {
        date:       new Date(data.date).toJSON(),
        unit:       metric.units,
        awake:      data.awake,
        core:       data.core,
        rem:        data.rem,
        inBed:      data.inBed,
        deep:       data.deep,
        asleep:     data.asleep,
        inBedStart: new Date(data.inBedStart).toJSON(),
        sleepStart: new Date(data.sleepStart).toJSON(),
        sleepEnd:   new Date(data.sleepEnd).toJSON(),
        inBedEnd:   new Date(data.inBedEnd).toJSON(),
    });

    return true;
}