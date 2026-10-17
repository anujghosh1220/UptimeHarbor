# UptimeHarbor - AWS Serverless Infrastructure
This is a minimal serverless setup for local development and deployment planning.

## Architecture Overview
- API Gateway (HTTP API)
- Lambda functions (API operations, health checks)
- DynamoDB tables (websites, checks, incidents)
- EventBridge Scheduler (recurring checks)
- CloudWatch Logs
- IAM roles with least privilege

## Free Tier Notes
- Lambda: 1M free requests, 400000 GB-seconds per month (always free)
- API Gateway: 1M HTTP API requests free for 12 months
- DynamoDB: 25GB storage, 25 RCU, 25 WCU free (always free)
- EventBridge Scheduler: 1M invocations free per month
- CloudWatch Logs: 5GB ingestion free

Always verify current AWS Free Tier at https://aws.amazon.com/free/
Do not assume credits cover all costs. Monitor billing.
