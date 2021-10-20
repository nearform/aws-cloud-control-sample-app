const AWS = require('aws-sdk')

const cloudcontrol = new AWS.CloudControl()
const ecr = new AWS.ECR()

const { ECR_REPOSITORY_NAME } = process.env

module.exports = Promise.all([deleteEcr(), deleteAppRunner()])

async function deleteAppRunner() {
  const TypeName = 'AWS::AppRunner::Service'
  const serviceName = `${ECR_REPOSITORY_NAME}-service`

  const appRunnerServices = await cloudcontrol
    .listResources({
      TypeName
    })
    .promise()

  const appRunnerService = appRunnerServices.ResourceDescriptions.find(
    r => JSON.parse(r.Properties).ServiceName === serviceName
  )

  if (!appRunnerService) {
    return
  }

  const appRunnerDeleteOutput = await cloudcontrol
    .deleteResource({
      TypeName,
      Identifier: appRunnerService.Identifier
    })
    .promise()

  await cloudcontrol
    .waitFor('resourceRequestSuccess', {
      RequestToken: appRunnerDeleteOutput.ProgressEvent.RequestToken
    })
    .promise()
}

async function deleteEcr() {
  const repositories = await cloudcontrol
    .listResources({
      TypeName: 'AWS::ECR::Repository'
    })
    .promise()

  const repository = repositories.ResourceDescriptions.find(
    r => r.Identifier === ECR_REPOSITORY_NAME
  )

  if (!repository) {
    return
  }

  // not using cloud control as it doesn't expose the force flag
  // which we need to delete the repo even if it has images
  await ecr
    .deleteRepository({
      repositoryName: ECR_REPOSITORY_NAME,
      force: true
    })
    .promise()
}
