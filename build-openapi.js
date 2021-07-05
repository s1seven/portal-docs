const SwaggerParser = require('@apidevtools/swagger-parser');
const axios = require('axios');
const { promises: fs } = require('fs');
const { dump } = require('js-yaml');
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
    version: mergeResult.output.info.version,
    contact: {},
  };
  output.servers = [{ url: 'https://app.s1seven.ovh' }, { url: 'https://app.s1seven.dev' }];
  output.security = [
    {
      bearer: [],
    },
    {
      Authentication: [],
    },
    {
      Refresh: [],
    },
  ];
  output.externalDocs = {
    description: 'Platform docs',
    url: 'https://s1seven.github.io/portal-docs/',
  };
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
    const yamlOpenAPI = dump(openApi);
    await fs.writeFile(`./openapi.yaml`, yamlOpenAPI);
  } catch (e) {
    console.log(e.toJSON());
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

(async function() {
  const services = ['auth', 'user', 'km', 'certificate', 'pipe'];
  try {
    const openApis = await downloadOpenAPIs(services);
    await mergeAPIs(openApis);
    console.log(`OpenAPI doc generated`);
  } catch (error) {
    console.error(error.message);
  }
})();
