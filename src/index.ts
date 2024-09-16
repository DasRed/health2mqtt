import Koa from 'koa';
import {koaBody} from 'koa-body';
import {AutoHealthExport} from './autoHealthExporterStruct';
import config from './config';
import connect from './mqttClient';
import publisher from './publisher';

const client = await connect();

const app = new Koa();
app.use(koaBody({jsonLimit: '100mb'}));

app.use(async (ctx) => {
    //console.log(new Date().toJSON(), JSON.stringify(ctx.request.body));

    const data: AutoHealthExport.Root = ctx.request.body;
    await data.data.metrics.reduce(async (promise, metric: AutoHealthExport.Metric) => {
        await promise
        return publisher(client, metric)
    }, Promise.resolve(true));

    ctx.status = 204;
});

app.listen(config.server.port);
console.log(`Listening on ${config.server.port}`);