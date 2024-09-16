export namespace AutoHealthExport {
    export type Root = {
        data: AutoHealthExport.Data;
    };

    export type Data = {
        metrics: Metric[];
    };

    export type Metric =
        | { name: 'active_energy' | 'basal_energy_burned'; units: 'kJ'; data: Value[]; }
        | { name: 'body_fat_percentage'; units: '%'; data: Value[]; }
        | { name: 'body_mass_index' | 'step_count'; units: 'count'; data: Value[]; }
        | { name: 'heart_rate'; units: 'count/min'; data: HeartRate[]; }
        | { name: 'lean_body_mass' | 'weight_body_mass'; units: 'kg'; data: Value[]; }
        | { name: 'sleep_analysis'; units: 'hr'; data: SleepAnalysis[]; }
        | { name: 'walking_step_length'; units: 'cm'; data: Value[]; }
        | { name: string; units: string; data: Generic[]; };

    export type Generic = {
        date: DateString;
        source: string;
        [key:string]: any;
    };

    export type Value = {
        date: DateString;
        qty: number;
        source: string;
    };

    export type HeartRate = {
        date: DateString;
        Max: number;
        Avg: number;
        Min: number;
        source: string;
    };

    export type SleepAnalysis = {
        date: DateString;
        awake: number;
        core: number;
        rem: number;
        inBed: number;
        deep: number;
        asleep: number;
        inBedStart: DateString;
        sleepStart: DateString;
        sleepEnd: DateString;
        inBedEnd: DateString;
        source: string;
    };
}
