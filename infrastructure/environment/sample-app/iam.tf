data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "apprunner-assume-role-policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["build.apprunner.amazonaws.com", "cloudformation.amazonaws.com"]
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
