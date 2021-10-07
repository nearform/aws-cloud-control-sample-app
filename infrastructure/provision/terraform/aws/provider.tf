terraform {
  required_providers {
    awscc = {
      source  = "hashicorp/awscc"
      version = "~> 0.1"
    }
  }
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile_name
}

# Configure the AWS Cloud Control Provider
provider "awscc" {
  region = var.region
}
