
# Feature Flags

This file manages system feature toggles for the NebulaForge Change Tracking System.

## Available Flags

- [x] advanced-notifications - Enhanced notification system with detailed metadata
- [x] auto-git-commit - Automatic git commits for tracked changes
- [x] markdown-linting - Automatic markdown validation and issue detection
- [x] auto-linking - Automatic inter-document linking in markdown files
- [ ] email-notifications - Email alerts for critical changes (requires SMTP setup)
- [ ] real-time-updates - WebSocket-based real-time file change updates
- [ ] bulk-operations - Batch file operations and multi-file processing
- [ ] version-comparison - Side-by-side version comparison interface
- [ ] ai-summaries - AI-generated change summaries using OpenAI
- [ ] webhook-integration - Webhook notifications for external services

## Feature Descriptions

### advanced-notifications
Enables rich notifications with metadata, severity levels, and detailed change information.

### auto-git-commit
Automatically commits changes to git when files are modified through the system.

### markdown-linting
Validates markdown files for common issues like broken links, improper headers, and formatting problems.

### auto-linking
Automatically creates hyperlinks between markdown files that reference each other.

### email-notifications
Sends email alerts for important changes (requires email service configuration).

### real-time-updates
Provides live updates to the dashboard when files change.

### bulk-operations
Enables processing multiple files at once for operations like search/replace.

### version-comparison
Adds visual diff capabilities to compare file versions.

### ai-summaries
Uses AI to generate human-readable summaries of file changes.

### webhook-integration
Sends HTTP webhooks to external services when changes occur.

## Usage

To toggle a feature, change `[ ]` to `[x]` or vice versa.
Changes are automatically detected and applied by the system.

## Configuration

Some features may require additional configuration:

- **email-notifications**: Requires SMTP settings in environment variables
- **ai-summaries**: Requires OpenAI API key
- **webhook-integration**: Requires webhook URL configuration

Last updated: 2024-12-21
