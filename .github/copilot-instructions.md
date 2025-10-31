# Review Instructions
**Our code reviews are focused, constructive, and respect development velocity. Only flag issues that are critical or significantly impact security, maintainability, or user experience. Do _not_ nitpick style or minor, non-blocking conventions.**

## Review Criteria

### 1. Compatibility & Non-Breaking Changes
- Ensure that proposed changes do **not break existing features or workflows**.
- Detect and flag any breaking changes in API endpoints, data formats, or user interfaces unless explicitly approved as a major version update.
- Confirm backward compatibility unless code is in a pre-release or experimental state.

### 2. Best Practices & Code Quality
- Only highlight **substantial violations** of best practices, such as misuse of async/await, improper state management, or inefficient algorithms.
- Encourage modular, DRY, and reusable architecture.
- Discourage overengineering and reject premature optimization.
- Highlight any obvious anti-patterns or technical debt introduced.

### 3. Security
- Identify and flag **potential security vulnerabilities**, such as:
  - Use of deprecated/insecure libraries or APIs.
  - Inadequate input validation or output encoding.
  - Hard-coded secrets or sensitive keys.
  - Exposed environment variables or tokens in code or logs.
  - Insecure configurations involving FastAPI, authentication/OAuth, or access control.

### 4. Error Handling & Robustness
- Require **robust error handling** for all external calls, file operations, database actions, and integrations—including Hugging Face and hardware detection.
- Flag any missing or ineffective error handling that can lead to silent failures, crashes, or confusing UX.

### 5. Deprecations & Maintenance
- **Identify usage of deprecated functions, methods, or APIs.**
- Request migration when dependencies release critical/major/breaking changes or mark features as deprecated.

### 6. Documentation & Clarity
- Ensure that **public functions, classes, and components** are documented where business logic or complex interfaces exist.
- Require updates to documentation and usage instructions if public APIs or important user-facing behaviors have changed.

### 7. Performance & Resource Usage
- Warn about **major performance issues** affecting training, inference, or serving large models—especially in scenarios relevant to local GPU constraints or multi-user sustainability.
- Suggest optimizations only for issues that have _clear, measurable impact_.

### 8. Test Coverage
- Check for corresponding tests when features are core or bug fixes are non-trivial.
- Request regression tests if changes fix previously reported issues.

***

**Do not:**
- Nitpick variable names, whitespace, or stylistic choices already enforced by automated tools.
- Repeat feedback already caught by linters, formatters, or standard unit tests.
