

resource "aws_apprunner_auto_scaling_configuration_version" "artist-info-auto-scaling-conf" {
  auto_scaling_configuration_name = "artist-info-scaling-conf"
  # scale between 1-5 containers
  min_size = 1
  max_size = 5
}

resource "aws_apprunner_service" "artist-info" {
  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.artist-info-auto-scaling-conf.arn

  service_name = "artist-info"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.ecr_apprunner_role.arn
    }
    image_repository {
      image_configuration {
        port = "5000"
      }

      image_identifier      = "932192134344.dkr.ecr.eu-west-1.amazonaws.com/artist-info"
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = true
  }
}
