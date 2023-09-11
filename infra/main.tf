terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-south-1"
}

data "aws_ami" "linux_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }
}

resource "aws_instance" "app_server" {
  ami           = data.aws_ami.linux_ami.id
  instance_type = "t3.micro"

  tags = {
    Name = "Degenex - ${terraform.workspace}"
  }
}
