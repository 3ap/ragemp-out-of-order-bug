const ws = require('ws');
const util = require('util')
const { performance } = require('perf_hooks')
const wss = new ws.Server({ host: "127.0.0.1", port: 8001 });

wss.on('connection', function connection(ws) {
	ws.on('error', console.error);
	ws.on('message', (data) => {
		const log = (...args) => ws.send(util.format.apply(null, args))
		try
		{
			const start = performance.now()
			eval(data.toString())
			const end = performance.now()
			ws.send(end-start)
		} catch (err) {
			console.log(err);
			ws.send(util.format(err));
		}
	});
});
