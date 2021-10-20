const AWS = require('aws-sdk')
const cloudcontrol = new AWS.CloudControl()

const { ECR_REPOSITORY, ECR_IMAGE_NAME } = process.env
const SERVICE_NAME = `${ECR_REPOSITORY}-service`

;(async function () {
  try {
    await cloudcontrol
      .getResource({
        TypeName: 'AWS::AppRunner::Service',
        Identifier: SERVICE_NAME
      })
      .promise()
    console.log('App runner service exists. Skipping creation.')
  } catch (e) {
    // service doesn't exist, create it

    const desiredState = {
      HealthCheckConfiguration: {
        HealthyThreshold: 1,
        Interval: 10,
        Path: '/',
        Protocol: 'HTTP',
        Timeout: 10,
        UnhealthyThreshold: 5
      },
      InstanceConfiguration: {
        Cpu: '1 vCPU',
        Memory: '2 GB'
      },
      ServiceName: SERVICE_NAME,
      SourceConfiguration: {
        ImageRepository: {
          ImageConfiguration: {
            Port: '5000'
          },
          ImageIdentifier: ECR_IMAGE_NAME,
          ImageRepositoryType: 'ECR'
        }
      },
      Tags: []
    }

    const resource = {
      TypeName: 'AWS::AppRunner::Service',
      DesiredState: JSON.stringify(desiredState)
    }

    try {
      const response = await cloudcontrol.createResource(resource).promise()
      console.log('App Runner service created', response)
    } catch (err) {
      console.log('Failed to create App Runner service', err)
    }
  }
})()
