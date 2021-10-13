## AWS Cloud Control and Terraform

Following the announcement by Amazon Web Services about the release of a new Cloud Control API, which provides a uniform API to access all AWS and some third-party services, we can now harness a new Terraform provider released by Hashicorp which allows us to consume and use this new Cloud Control API to provision and manage AWS services as soon as they are released, typically on the day of launch.

This new API will greatly increase the resouce coverage provided by Terraform, while reducing the lead time it takes to support new capabilities. Going forward, when new resource types are published to the AWS CloudFormation Public Registry, these will expose a standard JSON schema and can be consumed via the Cloud Control API or Terraform AWS Cloud Control Provider.

It is envisaged this new provider will be used alongside the existing AWS provider, thus both providers will be maintained by Hashicorp going forward.

It is also important to note that this new Terraform AWS provider is still in tech preview, at the time of writing, and use cases currently fall into a number of different brackets:
    * Experimentation with new AWS services before they are supported by the existing Terraform AWS Provider
    * Testing configurations in non-production environments (e.g. development or staging)
    * Building prototype deployments of newly released AWS services, which are not yet supported by the existing Terraform 


## AWS App Runner

Amazon Web Services have released a service that provides a fast, simple and cost-effective way to deploy either Nodejs or Python applications from source code repositories or container images, without the need to build or maintain complex deployment platforms or deployment pipelines. It provides CI and CD capabilities with fully managed workflows, scalability, and security.

App Runner empowers both development and operations teams to easily define and implement automatic deployments each time a commit is pushed to a code repository or a new container image version is pushed to ECR.


Interfacing with AWS App Runner can be achieved in the following ways:

* AWS Console - providing a web interface to manage App Runner services and GitHub connections
* App Runner API
* AWS CLI
* AWS SDKs
* IaC Tooling - e.g. Terraform

For the purpose of this blog post we are going to concentrate on describing how to interface with AWS App Runner using Hashicorp Terraform.


### Configuring AWS App Runner to deploy an ECR hosted container image:

Firstly, we need to configure a specific IAM role and policy to allow the App Runner service to pull images from ECR. The IAM policy required is as follows (replace `<<ecr_repository_name>>` as relevant): 

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ListImagesInRepository",
            "Effect": "Allow",
            "Action": [
                "ecr:ListImages"
            ],
            "Resource": "arn:aws:ecr:${region}:${account_id}:repository/<<ecr_repository_name>>"
        },
        {
            "Sid": "GetAuthorizationToken",
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken"
            ],
            "Resource": "*"
        },
        {
            "Sid": "ManageRepositoryContents",
            "Effect": "Allow",
            "Action": [
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:GetRepositoryPolicy",
                "ecr:DescribeRepositories",
                "ecr:ListImages",
                "ecr:DescribeImages",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ],
            "Resource": "arn:aws:ecr:${region}:${account_id}:repository/<<ecr_repository_name>>"
        }
    ]
}
```
Store the above JSON file (iam_ecr_policy.json) in a newly created templates folder under the infrastructure folder of your repository.

Next provision the aws_caller_identity, aws_iam_policy_document, aws_iam_role, aws_iam_policy and aws_iam_role_policy_attachment, see below:
```
data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "apprunner-assume-role-policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["apprunner.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecr_apprunner_role" {
  name               = "ecr_apprunner_role"
  assume_role_policy = data.aws_iam_policy_document.apprunner-assume-role-policy.json
}

resource "aws_iam_policy" "ecr_policy" {
  name        = "ecr-policy"
  path        = "/"
  description = "ecr-policy"

  policy = templatefile("${path.module}/templates/iam_ecr_policy.json", {
    region     = var.region
    account_id = data.aws_caller_identity.current.account_id
  })
}

resource "aws_iam_role_policy_attachment" "apprunner" {
  role       = aws_iam_role.ecr_apprunner_role.name
  policy_arn = aws_iam_policy.ecr_policy.arn
}
```

Next we can proceed to configure the AWS App Runner service and an optional auto scaling configuration (replacing `<<ecr_repository_name>>` as relevant):

```
resource "aws_apprunner_auto_scaling_configuration_version" "<<ecr_repository_name>>-auto-scaling-conf" {
  auto_scaling_configuration_name = "<<ecr_repository_name>>-scaling-conf"
  # scale between 1-5 containers
  min_size = 1
  max_size = 5
}

resource "aws_apprunner_service" "<<ecr_repository_name>>" {
  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.<<ecr_repository_name>>-auto-scaling-conf.arn

  service_name = "<<ecr_repository_name>>"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.ecr_apprunner_role.arn
    }
    image_repository {
      image_configuration {
        port = "5000"
      }

      image_identifier      = "932192134344.dkr.ecr.eu-west-1.amazonaws.com/<<ecr_repository_name>>"
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = true
  }
}
```

Finally using the terraform CLI, run with `terraform plan` to do a dry run and review the subsequent terraform plan to ensure only the expected actions are to be undertaken. If happy to do so, finally run `terraform create`

---
**Known issues:**
1. App Runner Connection created using Terraform; currently an issue exists when attempting to create a GitHub connection provisioned using Terraform. While it does create a new connection, an error occurs when attempting to complete the handshake
1. For now, AWS App Runner only support Nodejs version 12
---