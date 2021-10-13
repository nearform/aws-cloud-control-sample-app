
terraform {
  required_version = "~> 1.0.8"

  backend "s3" {
    bucket         = "nearform-terraform-infrastructure"
    key            = "terraform-state-APPLICATION-NAME.json" # Replace APPLICATION-NAME as relevant
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
    profile        = "nearform-platform" # profile name as configured in your ~/.aws/credentials
  }
}
