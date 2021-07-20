const SwaggerParser = require('@apidevtools/swagger-parser');
const axios = require('axios');
const { promises: fs } = require('fs');
const { merge } = require('openapi-merge');

async function mergeAPIs(openApis) {
  const inputs = openApis.map((openapi) => ({ oas: openapi }));
  const mergeResult = merge(inputs);
  if (mergeResult.type && mergeResult.message) {
    throw new Error(mergeResult.message);
  }

  const output = mergeResult.output;
  output.info = {
    title: 'S1Seven API',
    description: 'Microservices bundled APIs',
    version: mergeResult.output.info.version, // use pkg version ?
    contact: mergeResult.output.info.contact || {},
  };
  output.servers = [{ url: 'https://app.s1seven.ovh/api' }, { url: 'https://app.s1seven.dev/api' }];
  output.security = [
    {
      bearer: [],
    },
    {
      refresh: [],
    },
    {
      Authentication: [],
    },
    {
      Refresh: [],
    },
  ];

  try {
    const openApi = await SwaggerParser.validate(output, {
      dereference: {
        circular: 'ignore',
      },
      validate: {
        schema: true,
        spec: false,
      },
    });
    await fs.writeFile(`./openapi.json`, JSON.stringify(openApi, null, 2));
  } catch (e) {
    if (typeof e.toJSON === 'function') {
      console.warn(e.toJSON());
    }
    throw e;
  }
}

function downloadOpenAPI(service) {
  const url = `https://${service}.s1seven.ovh/api-json/`;
  return axios({
    method: 'get',
    url,
    responseType: 'json',
  }).then(({ data }) => {
    // remove unneeded, duplicate path
    delete data.paths['/'];
    return data;
  });
}

function downloadOpenAPIs(services) {
  return Promise.all(services.map((service) => downloadOpenAPI(service)));
}

(async function () {
  const services = ['auth', 'user', 'km', 'certificate', 'pipe'];
  try {
    const openApis = await downloadOpenAPIs(services);
    await mergeAPIs(openApis);
    console.log(`OpenAPI doc generated`);
  } catch (error) {
    console.error(error.message);
  }
})();
