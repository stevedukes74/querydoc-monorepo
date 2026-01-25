# QueryDoc - Lessons Learned

## AWS Deployment

### App Runner

- **Secrets management**: Use console configuration, not apprunner.yaml
- **Why**: App Runner's YAML doesn't support Parameter Store/Secrets Manager resolution
- **Best practice**: Keep build config in YAML, secrets in console

### Amplify

- **Purpose**: Hosting frontend SPAs with CI/CD
- **Alternative**: S3 + CloudFront (cheaper but manual)
- **When to use**: Modern frameworks (React/Vue) with GitHub integration

## Architecture Decisions

### Why App Runner over Lambda?

- Needed Server-Sent Events (SSE) for streaming
- Long-running connections
- Lambda has timeout limits

### Why Amplify over S3?

- Automatic builds on git push
- Preview deployments
- Built-in SSL/CDN

## SOLID Refactoring

### Key Patterns Used

- Services handle business logic
- Controllers handle HTTP
- Hooks manage state
- Components are pure UI

## Common Gotchas

### CORS Issues

- Backend needs to whitelist Amplify URL
- Update `CORS_ORIGIN` env var when frontend URL changes

### Empty Messages

- Filter out empty messages before sending to API
- Validation middleware checks for content

## Testing

### Frontend

- Mock FileReader in jsdom
- Use `waitFor` for async updates
- Object.defineProperty for read-only props

### Backend

- Import real app, not duplicated code
- Dependency injection for testability
- Mock at service layer, not module layer
