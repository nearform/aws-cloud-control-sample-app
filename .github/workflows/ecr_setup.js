const AWS = require('aws-sdk')

const cloudcontrol = new AWS.CloudControl()

const { ECR_REPOSITORY_NAME } = process.env

const TypeName = 'AWS::ECR::Repository'

async function run() {
  try {
    await cloudcontrol
      .getResource({
        TypeName,
        Identifier: ECR_REPOSITORY_NAME
      })
      .promise()
    console.log('ECR Repo exists. Skipping creation.')
  } catch (e) {
    const desiredState = {
      RepositoryName: ECR_REPOSITORY_NAME,
      ImageTagMutability: 'MUTABLE'
    }

    await cloudcontrol
      .createResource({
        TypeName,
        DesiredState: JSON.stringify(desiredState)
      })
      .promise()
    console.log('ECR Repo created')
  }
}

return run()
