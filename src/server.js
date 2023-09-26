const hapi = ('@hapi/hapi');
const routes = require ('./routes');


const init = async () => {
    const server = hapi.server({
        port : 9000,
        host : "localhost",

        routes : {
            cors: {
                origin:['*'],
            },
        },
    });

    server.routes(routes);

    await server.start();
    console.log(`server bekerja pada ${server.info.uri}`);
}
init();