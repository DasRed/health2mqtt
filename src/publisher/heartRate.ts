import {AutoHealthExport} from '../autoHealthExporterStruct';
import {MqttClient} from '../mqttClient';

export default async function (client: MqttClient, metric: AutoHealthExport.Metric): Promise<boolean> {
    const dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);
    const entries = <AutoHealthExport.HeartRate[]>metric.data.filter(({date}) => dateToday <= new Date(date));
    if (entries.length === 0) {
        return true;
    }

    const data = entries.reduce((acc, {Min: min, Max: max, Avg: avg, date}, index) => {
        const dateObj = new Date(date);
        acc.date      = dateObj >= (acc.date ?? dateObj) ? dateObj : acc.date;

        acc.min = Math.min(acc.min ?? min, min);
        acc.max = Math.min(acc.max ?? max, max);
        acc.sum += avg;
        acc.avg = acc.sum / (index + 1);

        return acc;
    }, {
        min:  undefined,
        max:  undefined,
        avg:  undefined,
        sum:  0,
        date: undefined
    });

    await client.publishH2M(`${metric.name}/current`, {
        date: data.date.toJSON(),
        unit: metric.units,
        min:  data.min,
        avg:  data.avg,
        max:  data.max,
    });

    return true;
}