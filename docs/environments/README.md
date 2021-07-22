
# Environments

The Blockchain and service environemnts and their interconnection are described. Furthermore, a simple process for the development and going live is outlined.

[[toc]]

## Blockchain Environment

| Environment | Network | Operators |
|---|---|---|
| Live network | bcdb.thematerials.network | Users and initially S1Seven |
| Staging network | test.bcdb.thematerials.network | S1Seven |
| Development network | dev.bcdb.thematerials.network | S1Seven |

Notes

1. All nodes of dev.bcdb.thematerials.network are reset daily at 4pm to simply testing: the certificate service calculates the hash of the certificate and checks if that hash has been already notarized on the blockchain. If so the services does not continue with the process. This allows developers to execute test runs at least once a day with the same data set.
2. Users operating a live Blockchain node can connect to that directly by changing the configured node their own, e.g. for main network switching from `https://bcdb.thematerials.network` to `https://my-company.network.node`.

## Service Environments

| Environment | Service | Purpose |
|---|---|---|
| Live | app.s1seven.com | Live operations |
| Staging | app.s1seven.dev | For users to test the setup of integrations | 
| Development | app.s1seven.ovh | For developers building and testing integrations |

## Wallets

In each service environment two wallets can be created and connected to different blockchain environments to support smooth development, testing, going live and continuous operations.

| Service environment | Wallet/Mode | Wallet quality | connected Blockchain environment |
|---|---|---|---|
| Live | `live` | HSM | Live |
| | `test` | Software | Staging or Development |
| Staging | `live` | HSM  | Staging |
| | `test` | Software | Development |
| Development | `live` | Software | Development |
| | `test` | Software | Development |

For the setup of HSM wallets the following naming convention must be followed:

| Environment | Convention | Example Company | Example |
|---|---|---|---|
| Live | | Super Metal AG | `super-metal-ag-production`|
| Staging | | Super Metal AG | `super-metal-ag-staging`|

## Process for Integrators

Integrators are building applications on top of the S1Seven API which then are delivered to customers. The proposed process is to

1. Do development work and testing against the development environments
2. Do integration testing against the staging development.

## Process for Users

Users are installing and using applications. The proposed process is to

1. Install the application on the staging system and execute acceptance testing against the service staging environment.
2. Install the application on the customers production system and execute the final acceptance testing in mode `test` against the staging blockchain. Going live is then simply switching the mode to `live`.

