# API Gateway Service

This is the API Gateway service for the Real-time Safety Monitoring Platform.

## Testing

This service includes comprehensive unit tests using Jest covering:

1. **REST Controller Endpoints**:
   - Telemetry endpoints (list, get)  
   - Alerts endpoints (list, unacknowledged, acknowledge)
   - Health check endpoint
   - Metrics endpoint

2. **Query Service Integration**:
   - TelemetryQueryService methods
   - AlertsQueryService methods

3. **Health Check Functionality**:
   - Health endpoint response validation

4. **Error Handling**:
   - Graceful handling of invalid inputs
   - Edge case scenarios

5. **Data Validation and Response Formatting**:
   - Proper data types and structures
   - Response format validation

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Test Structure

- `src/__tests__/telemetry.controller.spec.ts` - Telemetry controller tests
- `src/__tests__/alerts.controller.spec.ts` - Alerts controller tests
- `src/__tests__/telemetry-query.service.spec.ts` - Telemetry query service tests
- `src/__tests__/alerts-query.service.spec.ts` - Alerts query service tests
- `src/__tests__/health.controller.spec.ts` - Health controller tests
- `src/__tests__/metrics.controller.spec.ts` - Metrics controller tests
- `src/__tests__/data-validation.spec.ts` - Data validation and format tests
- `src/__tests__/telemetry.controller.error.spec.ts` - Error handling tests