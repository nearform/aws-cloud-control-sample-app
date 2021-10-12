resource "aws_apprunner_auto_scaling_configuration_version" "artist-info-auto-scaling-conf" {
  auto_scaling_configuration_name = "artist-info-scaling-conf"
  # scale between 1-5 containers
  min_size = 1
  max_size = 5
}

resource "aws_apprunner_connection" "artist-info" {
  connection_name = "aws-apprunner-integration"
  provider_type   = "GITHUB"

  tags = {
    Name = "artist-info-apprunner-connection"
  }
}

resource "aws_apprunner_service" "artist-info" {
  service_name = "artist-info"

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.artist-info-auto-scaling-conf.arn

  source_configuration {
    authentication_configuration {
      connection_arn = aws_apprunner_connection.artist-info.arn
      # connection_arn = var.app_runner_github_connection_arn
    }
    code_repository {
      code_configuration {
        code_configuration_values {
          build_command = "npm install && npm run build"
          port          = "5000"
          runtime       = "NODEJS_12"
          start_command = "npm run serve"
        }
        configuration_source = "API"
      }
      repository_url = "https://github.com/nearform/aws-cloud-control-sample-app"
      source_code_version {
        type  = "BRANCH"
        value = "infra/scaffolding"
      }
    }
  }

  tags = {
    Name = "artist-info-apprunner-service"
  }
}
