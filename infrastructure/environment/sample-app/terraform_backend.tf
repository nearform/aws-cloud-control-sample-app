
terraform {
  required_version = "~> 1.0.8"

  backend "s3" {
    bucket         = "nearform-platform-infrastructure"
    key            = "terraform-state-sample-app.json"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "platform-state-lock"
    profile        = "nearform-platform"
  }
}
