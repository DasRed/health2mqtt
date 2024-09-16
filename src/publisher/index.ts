import {AutoHealthExport} from '../autoHealthExporterStruct';
import {MqttClient} from '../mqttClient';
import activeEnergy from './activeEnergy';
import basalEnergyBurned from './basalEnergyBurned';
import bodyFatPercentage from './bodyFatPercentage';
import bodyMassIndex from './bodyMassIndex';
import heartRate from './heartRate';
import leanBodyMass from './leanBodyMass';
import sleepAnalysis from './sleepAnalysis';
import stepCount from './stepCount';
import walkingStepLength from './walkingStepLength';
import weight from './weight';

const MAP: { [key: string]: (client: MqttClient, metric: AutoHealthExport.Metric) => Promise<boolean> } = {
    active_energy:       activeEnergy,
    basal_energy_burned: basalEnergyBurned,
    body_fat_percentage: bodyFatPercentage,
    body_mass_index:     bodyMassIndex,
    heart_rate:          heartRate,
    lean_body_mass:      leanBodyMass,
    sleep_analysis:      sleepAnalysis,
    step_count:          stepCount,
    walking_step_length: walkingStepLength,
    weight_body_mass:    weight,
};

export default async function publisher(client: MqttClient, metric: AutoHealthExport.Metric): Promise<boolean> {
    if (MAP[metric.name] === undefined) {
        console.log(`unknown metric: ${metric.name}`, metric.units, JSON.stringify(metric.data.slice(0, 2)));
        return false;
    }
    const length = metric.data.length;
    const result = await MAP[metric.name](client, metric);
    console.log(new Date().toJSON(), `${metric.name} done with ${length} entries`);
    return result;
}