const AWS = require('aws-sdk')

const cloudcontrol = new AWS.CloudControl()

const { ECR_REPOSITORY_NAME, ECR_IMAGE_NAME, AWS_ACCOUNT_ID } = process.env
const serviceName = `${ECR_REPOSITORY_NAME}-service`

const TypeName = 'AWS::AppRunner::Service'

async function run() {
  const services = await cloudcontrol
    .listResources({
      TypeName
    })
    .promise()

  const service = services.ResourceDescriptions.find(
    r => JSON.parse(r.Properties).ServiceName === serviceName
  )

  if (service) {
    return console.log(
      `App runner service ${serviceName} exists. Skipping creation`
    )
  }

  const desiredState = {
    ServiceName: serviceName,
    SourceConfiguration: {
      AuthenticationConfiguration: {
        AccessRoleArn: `arn:aws:iam::${AWS_ACCOUNT_ID}:role/service-role/AppRunnerECRAccessRole`
      },
      ImageRepository: {
        ImageConfiguration: {
          Port: '5000'
        },
        ImageIdentifier: `${ECR_IMAGE_NAME}:latest`,
        ImageRepositoryType: 'ECR'
      }
    }
  }

  const resource = {
    TypeName: TypeName,
    DesiredState: JSON.stringify(desiredState)
  }

  try {
    const response = await cloudcontrol.createResource(resource).promise()
    console.log('App Runner service creation', response)

    await cloudcontrol
      .waitFor('resourceRequestSuccess', {
        RequestToken: response.ProgressEvent.RequestToken
      })
      .promise()
  } catch (err) {
    console.error('Failed to create App Runner service', err)
  }
}

return run()
