# Environments

S1Seven provides different services environments, operation modes and Blockchain networks aiming to fulfill different use cases. 
This section decribes these environments and outline which one you should choose.

[[toc]]

## Blockchain Environment

| Environment         | Network                        | Operators                   |
| ------------------- | ------------------------------ | --------------------------- |
| Production network  | bcdb.thematerials.network      | Users and initially S1Seven |
| Staging network     | test.bcdb.thematerials.network | S1Seven                     |
| Development network | dev.bcdb.thematerials.network  | S1Seven                     |

::: tip
The nodes behind `dev.bcdb.thematerials.network` are deployed for testing purpose and are reset daily at 4pm. This allows developers to execute test runs at least once a day with the same data set.

The `certificate-service` calculates the hash of the certificate and checks if that hash has been already notarized on the blockchain, this process might not behave as expected in Development.
:::

## Service Environments

| Environment | Service         | Purpose                                          |
| ----------- | --------------- | ------------------------------------------------ |
| Production  | app.s1seven.com | Live operations                                  |
| Staging     | app.s1seven.dev | For users to test the setup of integrations      |
| Development | app.s1seven.ovh | For developers building and testing integrations |

## Wallets

In each service environment two operation modes are allowed, `test` and `live`. The `test` mode relies on software based wallets and should be used for development, evaluation and testing purposes, whereas the `live` mode involves HSM based wallet, deployed on demand.
Those modes can be seen as contexts under which blockchain related resources (wallets, identities, nodes) are scoped.
For each mode, a company can create one wallet and will automatically interact with the corresponding blockchain environment.

| Service environment | Wallet/Mode | Wallet quality | connected Blockchain environment |
| ------------------- | ----------- | -------------- | -------------------------------- |
| Production          | `live`      | HSM            | Live                             |
|                     | `test`      | Software       | Staging or Development           |
| Staging             | `live`      | HSM            | Staging                          |
|                     | `test`      | Software       | Development                      |
| Development         | `live`      | HSM            | Development                      |
|                     | `test`      | Software       | Development                      |

For the setup of HSM wallets the following naming convention is used as a prefix to generate deployment URLs:

| Environment | Convention | Example Company | Example                      |
| ----------- | ---------- | --------------- | ---------------------------- |
| Live        |            | Super Metal AG  | `super-metal-ag-production`  |
| Staging     |            | Super Metal AG  | `super-metal-ag-staging`     |
| Development |            | Super Metal AG  | `super-metal-ag-development` |

## Process for Integrators

Integrators building applications on top of the S1Seven API which are delivered to customers, are expected to develop their integration against the staging development.

## Process for Users

Users are installing and using applications. The proposed process is to install the application on the customers production system and execute the acceptance testing in mode `test` against the staging blockchain. Going live is then simply switching the mode to `live`.
