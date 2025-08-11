# Integration Tests

This directory contains comprehensive integration tests for the Skill Exchange application. These tests verify that different components work together correctly and that the application behaves as expected from a user's perspective.

## Test Coverage

### App Integration Tests (`App.integration.test.jsx`)
Tests the main application flow including:
- **Navigation Flow**: Testing navigation between different pages
- **Authentication Flow**: Testing login/logout and protected routes
- **Profile Management Flow**: Testing profile editing, validation, and saving
- **Matching Flow**: Testing the matching functionality and display
- **Error Handling**: Testing how the app handles API errors and edge cases

### Profile Page Integration Tests (`ProfilePage.integration.test.jsx`)
Tests the profile management functionality:
- **Profile Display**: Verifying profile information is displayed correctly
- **Profile Editing**: Testing edit mode, form validation, and save functionality
- **Form Validation**: Testing required field validation and email format validation
- **Error Handling**: Testing API error scenarios
- **Read-only Mode**: Testing viewing other users' profiles

### Matching Suggestions Integration Tests (`MatchingSuggestions.integration.test.jsx`)
Tests the matching functionality:
- **Match Display**: Testing how matches are displayed and paginated
- **User Interactions**: Testing chat buttons, profile viewing, and navigation
- **Profile View Mode**: Testing the profile viewing within matches
- **Error Handling**: Testing API errors and empty states
- **Rating Display**: Testing star rating display

## Running the Tests

### Run All Integration Tests
```bash
npm run test:integration
```

### Run Integration Tests with Coverage
```bash
npm run test:integration:coverage
```

### Run Specific Test File
```bash
npm test -- --testPathPattern=App.integration.test.jsx
```

### Run Tests in Watch Mode
```bash
npm test -- --testPathPattern=integration
```

## Test Structure

Each test file follows this structure:
1. **Setup**: Mock dependencies and prepare test data
2. **Action**: Simulate user interactions
3. **Assertion**: Verify expected outcomes
4. **Cleanup**: Reset mocks and state

## Mocking Strategy

- **Axios**: Mocked to simulate API responses and errors
- **AuthContext**: Mocked to test different authentication states
- **LocalStorage**: Mocked to test persistence
- **Window APIs**: Mocked for browser compatibility

## Key Testing Patterns

### User Event Testing
```javascript
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');
```

### Async Testing
```javascript
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### API Mocking
```javascript
mockedAxios.get.mockResolvedValue({
  data: { /* test data */ }
});
```

### Error Testing
```javascript
mockedAxios.get.mockRejectedValue(new Error('Network error'));
```

## Best Practices

1. **Test User Flows**: Focus on testing complete user journeys
2. **Mock External Dependencies**: Don't rely on real APIs or services
3. **Test Error Scenarios**: Ensure the app handles errors gracefully
4. **Use Descriptive Test Names**: Make it clear what each test verifies
5. **Clean Up After Tests**: Reset mocks and state between tests

## Coverage Goals

- **User Authentication**: 100% coverage of login/logout flows
- **Profile Management**: 100% coverage of CRUD operations
- **Matching System**: 100% coverage of match display and interaction
- **Navigation**: 100% coverage of page transitions
- **Error Handling**: 100% coverage of error scenarios

## Continuous Integration

These tests are designed to run in CI/CD pipelines and will:
- Fail fast on any breaking changes
- Provide detailed error messages
- Generate coverage reports
- Ensure code quality and reliability 