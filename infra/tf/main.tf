terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

locals {
  service_name     = "degenex-${terraform.workspace}"
  asset_logos_path = "${path.module}/../../assets/images/asset-logos"
}

variable "ses_emails" {
  type = set(string)

  default = ["dragproychev@gmail.com", "dr.proychev@gmail.com", "dragomirproychev@gmail.com"]
}

provider "aws" {
  region = "eu-south-1"
}

resource "aws_s3_bucket" "s3_bucket" {
  bucket = local.service_name

  tags = {
    Name = local.service_name
  }
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_ownership_controls" {
  bucket = aws_s3_bucket.s3_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "s3_public_access_block" {
  bucket = aws_s3_bucket.s3_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "s3_bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.s3_bucket_ownership_controls,
    aws_s3_bucket_public_access_block.s3_public_access_block
  ]

  bucket = aws_s3_bucket.s3_bucket.id
  acl    = "public-read"
}

resource "aws_s3_object" "s3_logos_folder" {
  bucket = aws_s3_bucket.s3_bucket.id
  acl    = "public-read"
  key    = "logos/"
}

resource "aws_s3_object" "s3_logos" {
  for_each = fileset(local.asset_logos_path, "*")

  bucket       = aws_s3_bucket.s3_bucket.id
  acl          = "public-read"
  key          = "logos/${each.value}"
  source       = "${local.asset_logos_path}/${each.value}"
  content_type = "image/svg+xml"
  etag         = filemd5("${local.asset_logos_path}/${each.value}")
}

resource "aws_cloudfront_origin_access_control" "cloudfront_s3_oac" {
  name                              = local.service_name
  description                       = local.service_name
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cloudfront_distribution" {
  origin {
    domain_name              = aws_s3_bucket.s3_bucket.bucket_regional_domain_name
    origin_id                = "s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_s3_oac.id
  }

  enabled = true

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }
}

resource "aws_ses_email_identity" "ses_email_entities" {
  for_each = var.ses_emails

  email = each.value
}
