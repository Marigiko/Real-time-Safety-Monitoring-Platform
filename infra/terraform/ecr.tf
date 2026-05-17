resource "aws_ecr_repository" "service_repo" {
  count = 4

  name = element(["ingestion-service", "processing-service", "alert-service", "api-gateway"], count)

  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

  lifecycle_rule {
    description = "Expire old untagged images"
    selection {
      tag_status = "untagged"
    }
    action {
      type = "expire"
    }
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_ecr_lifecycle_policy" "service_repo_policy" {
  count = 4

  repository = element(aws_ecr_repository.service_repo.*.name, count)

  policy = jsonencode({
    rules = [
      {
        description   = "Keep last 10 images"
        selection     = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
        }
        action = {
          type = "expire"
        }
        action {
          type = "count"
        }
      }
    ]
  })
}