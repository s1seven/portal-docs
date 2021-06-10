# General API information

[[toc]]

Integrating S1Seven services within your server application, such as a SAP module, an automated delivery note service, or any other application managing quality certificates, is accomplished with the S1Seven REST API.

This reference includes operations for completing the full CASP life cycle, including:

    Creating accounts
    Adding participants to an account
    Creating vaults
    Depositing money into vaults
    Withdrawing money from vaults
    Managing keychains

See the Unbound CASP User Guide for details about installing CASP.

## Swagger

All endpoints documented here will link to a Swagger UI hosted by our staging webservices.

1. On the top left, select the server address matching the address of the Swagger you are currently browsing.

2. On the top left, click `Authorize` button. Once logged in or if you use a long lived access token, fill the `bearer` field with your access token.

## Services

### Auth service

Click [here](https://auth.s1seven.dev/api) to open the Authentication service APIs.

The auth service is responsible for all authentication operations such as login / logout, access token generation and sessions management.

### User service

Click [here](https://user.s1seven.dev/api) to open the User service APIs.

The user service is responsible for all CRUD operations related to user resources management.

### Key Management service

Click [here](https://km-test.s1seven.dev/api) to open the Key Management service APIs.

The KM service allows to manage resources related to crypto operations such as wallets, identities, transactions.

### Certificate service

Click [here](https://certificate.s1seven.dev/api) to open the Certificate service APIs.

The Certificate service allows to manipulate quality certificates. The logical flow to use its API would be the following :

1. Validate the certificate being created on your application

2. Render the certificate as PDF or HTML once it is valid

3. Notarize the certificate on the blockchain once the product is ready to be delivered

4. Verify that a certificate received from a partner has been notarized

### Pipe service

Click [here](https://pipe.s1seven.dev/api) to open the Pipe service APIs.

The Pipe service allows to synchronize in realtime your application workflow with resources managed on S1Seven platform.

You can register webhooks or create email subscriptions to watch changes on selected resources and to be notified of these events.

## REST API Requests

The API prefix for all S1Seven REST endpoints is:

`https://<s1seven-proxy>/<service>`

The value for `<service>` is the name of the service, such as auth-service, user-service, km-service, certificate-service, pipe-service.

## Error Handling

Responses are formatted in the standard REST format, with a status field showing an error code and an error field with a text description of the error. The possible error codes are described with each API.

For example, here is the response for a failed login request:

`https://<s1seven-proxy>/auth-service/login`

```json
{
  "statusCode": 401,
  "path": "/auth/login",
  "timestamp": "2021-06-10T14:40:52.602Z",
  "message": "Wrong credentials provided"
}
```
