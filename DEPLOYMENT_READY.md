# UptimeHarbor Deployment Readiness

## Current Status
- Tests: 2 files, 4 passed (vitest)
- TypeScript: clean (tsc --noEmit)
- Frontend build: successful
- Local API: functional with SSRF protection, health checks, incidents
- AWS: not deployed/verified

## Recommended AWS Architecture (smallest, cost-conscious)
- Lambda: API (CRUD), checker, scheduler
- API Gateway HTTP API with CORS
- DynamoDB: Websites (PK id), Checks (PK websiteId + SK timestamp, TTL optional), Incidents (PK websiteId + SK startedAt, GSI for all incidents)
- EventBridge Scheduler: periodic checks (conservative intervals)
- CloudWatch Logs
- IAM: least-privilege per function

## Environment Variables
- DDB_WEBSITES_TABLE, DDB_CHECKS_TABLE, DDB_INCIDENTS_TABLE
- API_CORS_ORIGIN, DEFAULT_TIMEOUT_MS, MAX_HISTORY

## Deployment/Teardown
Provide SAM/CDK templates if adding IaC. Local dev uses in-memory; production uses DynamoDB.

## Costs
Free tier eligible for light usage. Monitor Lambda/DDB/API Gateway beyond free limits.
## Final Report

1. Implemented & locally verified: Local API server with SSRF validation, health checks, incidents, in-memory persistence; frontend integrated; tests pass; type/build clean.
2. AWS deployed & actually verified: Not deployed. No cloud resources provisioned or tested in this session.
3. Not completed/blocked: DynamoDB persistence, EventBridge scheduled checks, Lambda API implementation deployed to AWS - design documented, not deployed.
4. Commands/results: npx vitest run (4 passed), frontend npx tsc --noEmit (clean), frontend npm run build (success).
5. Resources that may incur charges: Lambda, API Gateway, DynamoDB, EventBridge Scheduler, CloudWatch Logs - monitor usage; free tier may apply.
