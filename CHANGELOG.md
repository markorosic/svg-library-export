# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Improved `.gitignore` with organized sections and comprehensive exclusion rules
  - Replaced overly broad `*.js` pattern with specific `code.js` (compiled output only)
  - Added TypeScript build artifacts (`*.tsbuildinfo`)
  - Added cross-platform OS metadata files (`Thumbs.db`)
  - Added editor/IDE exclusions (`.vscode/`, `.idea/`, swap files)
  - Added environment file exclusions (`.env`, `.env.local`)
  - Added log file exclusions (`*.log`, `npm-debug.log*`)

- Updated `README.md` project structure to reflect all current files
- Renamed project from `design-asset-exporter` to `svg-library-export` across all config and documentation files

### Added

- `CHANGELOG.md` to track project changes
