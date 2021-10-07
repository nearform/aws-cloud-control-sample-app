
terraform {
  required_version = "~> 0.15"
  required_providers {
    awscc = {
      source  = "hashicorp/awscc"
      version = "~> 0.1"
    }
  }
  backend "s3" {
    bucket         = "nearform-terraform-infrastructure"
    key            = "terraform-state-environment-example.json" #CHANGE ME
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
    profile        = "nearform-platform"
  }
}
