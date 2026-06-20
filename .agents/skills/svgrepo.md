# Skill: Fetch Icons from SVG Repo

## Capabilities
- Can fetch public vector assets directly from svgrepo.com based on UI requirements.

## Operating Rules
1. Whenever the user asks for an icon (e.g., "add a gear icon"), look up the icon on SVG Repo.
2. Use Python `requests` or `curl` to pull the SVG data programmatically.
3. SVG Repo URLs follow a predictable pattern: `https://svgrepo.com<keyword>/`
4. Parse the page, extract the raw `<svg>` code, and clean it up.
5. Save the final file to the project's `./src/assets/icons/` folder using camelCase naming conventions.
