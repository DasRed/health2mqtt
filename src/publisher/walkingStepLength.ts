import {AutoHealthExport} from '../autoHealthExporterStruct';
import {MqttClient} from '../mqttClient';

export default async function (client: MqttClient, metric: AutoHealthExport.Metric): Promise<boolean> {
    const dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);
    const entries = <AutoHealthExport.Value[]>metric.data.filter(({date}) => dateToday <= new Date(date));
    if (entries.length === 0) {
        return true;
    }

    const data = entries.reduce((acc, {qty: value, date}) => {
        const dateObj = new Date(date);
        acc.value += value;
        acc.date      = dateObj >= (acc.date ?? dateObj) ? dateObj : acc.date;
        return acc;
    }, {value: 0, date: undefined});

    await client.publishH2M(`${metric.name}/current`, {
        value: data.value / entries.length,
        date:  data.date.toJSON(),
        unit:  metric.units
    });

    return true;
}