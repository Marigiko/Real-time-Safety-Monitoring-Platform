module "rds" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "rtsp-db"

  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = var.db_instance_class
  allocated_storage    = var.db_allocated_storage
  storage_encrypted    = true
  storage_type         = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  multi_az               = var.environment == "production" ? true : false
  backup_retention_period = var.environment == "production" ? 7 : 1
  skip_final_snapshot    = var.environment != "production"

  vpc_security_group_ids = [aws_security_group.rds.id]

  db_subnet_group_name = module.vpc.database_subnet_group_name

  tags = {
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name        = "rtsp-rds-sg"
  description = "Security group for RDS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rtsp-rds-sg"
  }
}