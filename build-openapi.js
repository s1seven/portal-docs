const SwaggerParser = require('@apidevtools/swagger-parser');
const axios = require('axios');
const { promises: fs } = require('fs');
const omit = require('lodash.omit');
const { join } = require('path');
const { merge } = require('openapi-merge');

// fix schemas merge issues (schemas incremented by suffix)
function solveMergeConflicts(mergeOutput) {
  const conflictedSchemas = [
    'IdentityDto',
    'WalletDto',
    'TransactionDto',
    'AddressDto',
    'UserDto',
    'CompanyDto',
    'ErrorResponseDto',
    'NotFoundErrorResponseDto',
    'UnauthorizedErrorResponseDto',
    'ForbiddenErrorResponseDto',
  ];
  const possibleSuffixes = [1, 2, 3];
  const incrementedSchemas = conflictedSchemas
    .map((schema) => possibleSuffixes.map((suffix) => `${schema}${suffix}`))
    .flat();

  mergeOutput.components.schemas = omit(mergeOutput.components.schemas, incrementedSchemas);

  const stringifiedOutput = conflictedSchemas.reduce(
    (acc, schema) => possibleSuffixes.reduce((subAcc, suffix) => subAcc.replaceAll(`${schema}${suffix}`, schema), acc),
    JSON.stringify(mergeOutput),
  );
  return JSON.parse(stringifiedOutput);
}

async function mergeAPIs(openApis, localFiles) {
  const inputs = openApis.map((openapi) => ({ oas: openapi }));
  const mergeResult = merge(inputs);
  if (mergeResult.type && mergeResult.message) {
    throw new Error(mergeResult.message);
  }

  let output = mergeResult.output;
  output.info = {
    title: 'S1Seven API',
    description: 'Microservices bundled APIs',
    version: output.info.version, // use pkg version ?
    contact: output.info.contact || {},
  };
  output.servers = localFiles
    ? [{ url: 'http://localhost/api' }]
    : [{ url: 'https://app.s1seven.ovh/api' }, { url: 'https://app.s1seven.dev/api' }];

  output.security = [
    {
      bearer: [],
    },
    {
      refresh: [],
    },
    {
      token: [],
    },
  ];

  output.components.securitySchemes = {
    bearer: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    refresh: {
      type: 'apiKey',
      in: 'header',
      name: 'Refresh',
    },
    token: {
      type: 'apiKey',
      in: 'query',
      name: 'token',
    },
  };

  output = solveMergeConflicts(output);

  try {
    const openApi = await SwaggerParser.validate(output, {
      dereference: {
        circular: 'ignore',
      },
      validate: {
        schema: true,
        spec: true,
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

function cleanupSpecs(specs) {
  // delete tag 'Service'
  const serviceTagIndex = specs.tags.findIndex((tag) => tag.name === 'Service');
  if (serviceTagIndex > -1) {
    specs.tags.splice(serviceTagIndex, 1);
  }
  // remove unneeded, duplicate path
  delete specs.paths['/'];
  return specs;
}

function downloadOpenAPI(service) {
  const url = `https://${service}.s1seven.ovh/api-json/`;
  return axios({
    method: 'get',
    url,
    responseType: 'json',
  }).then(({ data }) => cleanupSpecs(data));
}

function downloadOpenAPIs(services) {
  return Promise.all(services.map((service) => downloadOpenAPI(service)));
}

function readOpenAPI(service) {
  const filePath = join(process.cwd(), `../${service}-service/openapi.json`);
  return fs.readFile(filePath, 'utf-8').then((file) => cleanupSpecs(JSON.parse(file)));
}

function readOpenAPIs(services) {
  return Promise.all(services.map((service) => readOpenAPI(service)));
}

(async function (argv) {
  const localFiles = argv[2] || null;
  const services = ['auth', 'user', 'km', 'certificate', 'pipe'];
  try {
    const openApis = localFiles ? await readOpenAPIs(services) : await downloadOpenAPIs(services);
    await mergeAPIs(openApis, localFiles);
    console.log(`OpenAPI doc generated`);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
})(process.argv);
