# Rootly Alert Action

[![GitHub Super-Linter](https://github.com/PandasWhoCode/rootly-alert-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/PandasWhoCode/rootly-alert-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/PandasWhoCode/rootly-alert-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/PandasWhoCode/rootly-alert-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/PandasWhoCode/rootly-alert-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/PandasWhoCode/rootly-alert-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

A GitHub Action that creates alerts in Rootly using the Rootly REST API. Perfect
for integrating incident management into your CI/CD workflows, monitoring
deployments, and automating alert creation based on workflow events.

## Features

- ✅ **Create Rootly alerts** from GitHub Actions workflows
- ✅ **Flexible notification targets** - Users, Services, Groups, or Escalation
  Policies
- ✅ **Rich alert metadata** - External IDs, URLs, labels, and environment
  associations
- ✅ **Service integration** - Associate alerts with specific services and
  groups
- ✅ **Deduplication support** - Prevent duplicate alerts with custom keys
- ✅ **Comprehensive testing** - 100% test coverage with robust error handling

## Quick Start

### Prerequisites

- A [Rootly](https://rootly.com) account with API access
- A Rootly API key (available in your Rootly dashboard under Settings → API
  Keys)

### Basic Usage

```yaml
- name: Create Rootly Alert
  uses: PandasWhoCode/rootly-alert-action@v1
  with:
    api_key: ${{ secrets.ROOTLY_API_KEY }}
    summary: 'Deployment Failed'
    details: 'Production deployment failed for ${{ github.repository }}'
    notification_target_type: 'User'
    notification_target: 'devops@company.com'
```

## Inputs

### Required Parameters

| Parameter                  | Description                                         | Example                                                |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| `api_key`                  | Your Rootly API key                                 | `${{ secrets.ROOTLY_API_KEY }}`                        |
| `summary`                  | Brief description of the alert                      | `"Database connection failed"`                         |
| `details`                  | Detailed description of the alert                   | `"Production database is unreachable"`                 |
| `notification_target_type` | Type of notification target                         | `"User"`, `"Service"`, `"Group"`, `"EscalationPolicy"` |
| `notification_target`      | Target identifier (email for User, name for others) | `"user@company.com"` or `"Backend Team"`               |

### Optional Parameters

| Parameter           | Description                       | Default  | Example                                            |
| ------------------- | --------------------------------- | -------- | -------------------------------------------------- |
| `set_as_noise`      | Mark alert as noise               | `false`  | `"true"`                                           |
| `alert_urgency`     | Alert urgency level               | `"High"` | `"Low"`, `"Medium"`, `"High"`, `"Critical"`        |
| `external_id`       | External reference ID             | -        | `"DEPLOY-123"`                                     |
| `external_url`      | External reference URL            | -        | `"https://github.com/owner/repo/actions/runs/123"` |
| `services`          | Comma-separated service names     | -        | `"api-service,web-service"`                        |
| `alert_groups`      | Comma-separated group names       | -        | `"backend-team,devops-team"`                       |
| `labels`            | Comma-separated key:value pairs   | -        | `"env:prod,team:backend,severity:high"`            |
| `environments`      | Comma-separated environment names | -        | `"production,staging"`                             |
| `deduplication_key` | Key to prevent duplicate alerts   | -        | `"23093983-3274-2345-3253823984"`                  |

## Outputs

| Output     | Description                 |
| ---------- | --------------------------- |
| `alert_id` | The ID of the created alert |

## Usage Examples

### Basic Alert

```yaml
- name: Create Basic Alert
  uses: PandasWhoCode/rootly-alert-action@v1
  with:
    api_key: ${{ secrets.ROOTLY_API_KEY }}
    summary: 'Build Failed'
    details: 'CI build failed on main branch'
    notification_target_type: 'User'
    notification_target: 'developer@company.com'
```

### Deployment Failure Alert

```yaml
- name: Deployment Failure Alert
  uses: PandasWhoCode/rootly-alert-action@v1
  with:
    api_key: ${{ secrets.ROOTLY_API_KEY }}
    summary: 'Production Deployment Failed'
    details: 'Deployment of ${{ github.sha }} to production failed'
    notification_target_type: 'EscalationPolicy'
    notification_target: 'Production Incidents'
    alert_urgency: 'Critical'
    external_id: 'deploy-${{ github.run_id }}'
    external_url:
      '${{ github.server_url }}/${{ github.repository }}/actions/runs/${{
      github.run_id }}'
    services: 'web-app,api-service'
    environments: 'production'
    labels: 'deployment:failed,branch:${{ github.ref_name }}'
    deduplication_key: 'deploy-failure-${{ github.sha }}'
```

### Service Health Check Alert

```yaml
- name: Service Health Alert
  uses: PandasWhoCode/rootly-alert-action@v1
  with:
    api_key: ${{ secrets.ROOTLY_API_KEY }}
    summary: 'Service Health Check Failed'
    details: 'Health check endpoint returned 500 status'
    notification_target_type: 'Service'
    notification_target: 'API Service'
    alert_urgency: 'High'
    services: 'api-service'
    environments: 'production'
    labels: 'type:health-check,status:failed'
```

### Team Notification Alert

```yaml
- name: Team Alert
  uses: PandasWhoCode/rootly-alert-action@v1
  with:
    api_key: ${{ secrets.ROOTLY_API_KEY }}
    summary: 'Security Scan Failed'
    details: 'Security vulnerability detected in dependencies'
    notification_target_type: 'Group'
    notification_target: 'Security Team'
    alert_urgency: 'Medium'
    labels: 'type:security,scan:dependencies'
    external_url: '${{ github.server_url }}/${{ github.repository }}/security'
```

## Workflow Integration Examples

### On Deployment Failure

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Deploy Application
        id: deploy
        run: |
          # Your deployment script here
          ./deploy.sh
        continue-on-error: true

      - name: Create Alert on Deployment Failure
        if: steps.deploy.outcome == 'failure'
        uses: PandasWhoCode/rootly-alert-action@v1
        with:
          api_key: ${{ secrets.ROOTLY_API_KEY }}
          summary: 'Production Deployment Failed'
          details:
            'Deployment of commit ${{ github.sha }} failed. Check logs for
            details.'
          notification_target_type: 'EscalationPolicy'
          notification_target: 'Production Incidents'
          alert_urgency: 'Critical'
          external_id: 'deploy-${{ github.run_id }}'
          external_url:
            '${{ github.server_url }}/${{ github.repository }}/actions/runs/${{
            github.run_id }}'
          services: 'web-app,api-service'
          environments: 'production'
          labels: 'deployment:failed,branch:main,commit:${{ github.sha }}'
          deduplication_key: 'deploy-failure-${{ github.sha }}'
```

### On Test Failure

```yaml
name: CI Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Run Tests
        id: test
        run: npm test
        continue-on-error: true

      - name: Alert on Test Failure
        if: steps.test.outcome == 'failure' && github.ref == 'refs/heads/main'
        uses: PandasWhoCode/rootly-alert-action@v1
        with:
          api_key: ${{ secrets.ROOTLY_API_KEY }}
          summary: 'Main Branch Tests Failed'
          details: 'Tests failed on main branch for commit ${{ github.sha }}'
          notification_target_type: 'Group'
          notification_target: 'Development Team'
          alert_urgency: 'High'
          external_url:
            '${{ github.server_url }}/${{ github.repository }}/actions/runs/${{
            github.run_id }}'
          labels: 'tests:failed,branch:main'
```

### Scheduled Health Check

```yaml
name: Health Check

on:
  schedule:
    - cron: '*/5 * * * *' # Every 5 minutes

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Service Health
        id: health
        run: |
          if ! curl -f https://api.myservice.com/health; then
            echo "health_status=failed" >> $GITHUB_OUTPUT
          else
            echo "health_status=ok" >> $GITHUB_OUTPUT
          fi

      - name: Create Health Alert
        if: steps.health.outputs.health_status == 'failed'
        uses: PandasWhoCode/rootly-alert-action@v1
        with:
          api_key: ${{ secrets.ROOTLY_API_KEY }}
          summary: 'Service Health Check Failed'
          details: 'API health endpoint is not responding'
          notification_target_type: 'Service'
          notification_target: 'API Service'
          alert_urgency: 'High'
          services: 'api-service'
          environments: 'production'
          labels: 'type:health-check,status:failed'
          deduplication_key: 'health-check-api-service'
```

## Configuration

### Setting up Secrets

1. In your GitHub repository, go to **Settings** → **Secrets and variables** →
   **Actions**
1. Click **New repository secret**
1. Name: `ROOTLY_API_KEY`
1. Value: Your Rootly API key from your Rootly dashboard

### Notification Target Types

| Type               | Description       | Target Format                              |
| ------------------ | ----------------- | ------------------------------------------ |
| `User`             | Individual user   | Email address (e.g., `user@company.com`)   |
| `Service`          | Rootly service    | Service name (e.g., `API Service`)         |
| `Group`            | Rootly group      | Group name (e.g., `Backend Team`)          |
| `EscalationPolicy` | Escalation policy | Policy name (e.g., `Production Incidents`) |

### Alert Urgency Levels

- `Low` - Non-critical issues
- `Medium` - Standard priority issues
- `High` - Important issues requiring attention (default)

## Best Practices

### 1. Use Deduplication Keys

Prevent duplicate alerts by using unique deduplication keys:

```yaml
deduplication_key: '12345678-3240-3240-2349520394' # rootly alert id
```

### 2. Include Contextual Information

Add relevant context to help responders:

```yaml
external_id: 'build-${{ github.run_id }}'
external_url:
  '${{ github.server_url }}/${{ github.repository }}/actions/runs/${{
  github.run_id }}'
labels: 'branch:${{ github.ref_name }},commit:${{ github.sha }}'
```

### 3. Use Appropriate Urgency Levels

Match urgency to the actual impact:

- Production issues: `High`
- Staging issues: `Medium`
- Development issues: `Low`

### 4. Use the right target for your rootly instance

Use appropriate notification targets:

- Critical production issues → Escalation Policy
- Service-specific issues → Service
- Team-specific issues → Group
- Individual notifications → User

## Troubleshooting

### Common Issues

#### Invalid API Key

```text
Error: Authentication failed
```

- Verify your API key is correct
- Ensure the secret is properly set in GitHub

#### Target Not Found

```text
Error: Notification target not found
```

- Check the target name matches exactly in Rootly
- Verify the target type is correct

#### Service Not Found

```text
Error: Service 'service-name' not found
```

- Ensure service names match exactly as configured in Rootly
- Check for typos in comma-separated lists

### Debug Mode

Enable debug logging by setting the `ACTIONS_STEP_DEBUG` secret to `true` in
your repository settings.

## Contributing

1. Fork the repository
1. Create a feature branch
1. Make your changes
1. Add tests for new functionality
1. Run `npm run all` to test, lint, and build
1. Submit a pull request

## License

This project is licensed under the Apache 2.0 License - see the
[LICENSE](LICENSE) file for details.

## Support

- [Rootly Documentation](https://docs.rootly.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Issue Tracker](https://github.com/PandasWhoCode/rootly-alert-action/issues)
