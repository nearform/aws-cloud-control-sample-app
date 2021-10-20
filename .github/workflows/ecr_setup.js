const AWS = require('aws-sdk')
const cloudcontrol = new AWS.CloudControl()

const { ECR_REPOSITORY } = process.env
;(async function () {
  try {
    await cloudcontrol
      .getResource({
        TypeName: 'AWS::ECR::Repository',
        Identifier: ECR_REPOSITORY
      })
      .promise()
    console.log('ECR Repo exists. Skipping creation.')
  } catch (e) {
    // aws repo does not exist - create it

    const desiredState = {
      RepositoryName: ECR_REPOSITORY,
      ImageTagMutability: 'MUTABLE'
    }

    const response = await cloudcontrol
      .createResource({
        TypeName: 'AWS::ECR::Repository',
        DesiredState: JSON.stringify(desiredState)
      })
      .promise()
    console.log('ECR Repo created')
  }
})()
