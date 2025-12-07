# Iconify Manager

A command-line tool for managing IconifyJSON file, providing RESTful API and web interface to manage icons.

## Features

- 📁 **Icon Management**: Add, update, delete, and query icons
- 🔄 **SVG Processing**: Automatically clean and optimize SVG code
- 🎨 **Color Control**: Support preserving or removing SVG colors
- 🌐 **Web Interface**: Visual icon management interface
- 📡 **RESTful API**: Complete API endpoints for programmatic management
- 🚀 **Quick Start**: Start directly with npx

## Usage

Run directly with npx:

```bash
npx iconify-manager --path=<IconifyJSON file path> [--port=<port number>]
```

### Parameters

- `--path` (required): Path to the IconifyJSON file (supports relative and absolute paths)
- `--port` (optional): Server port number, defaults to `7770`

### Examples

```bash
# Use default port 7770
npx iconify-manager --path=./iconify.json

# Specify custom port
npx iconify-manager --path=./iconify.json --port=8080

# Use absolute path
npx iconify-manager --path=C:\Users\username\iconify.json
```

## Web Interface

After starting the server, visit the following URL to access the web management interface:

```
http://localhost:7770/iconify-viewer/
```

In the web interface, you can:
- View all icons
- Add new icons
- Edit existing icons
- Delete icons
- Rename icons

## API Documentation

All API endpoints are located under the `/api` path.

### Get All Icons

```http
GET /api/icons
```

**Response Example:**

```json
[
  {
    "name": "icon-name",
    "svg": "<svg>...</svg>"
  }
]
```

### Add Icon

```http
POST /api/icon
Content-Type: application/json

{
  "name": "icon-name",
  "svg": "<svg>...</svg>",
  "keepColor": true
}
```

**Parameters:**
- `name` (required): Icon name
- `svg` (required): SVG code
- `keepColor` (optional): Whether to preserve colors, defaults to `true`

**Response Example:**

```json
{
  "message": "Icon \"icon-name\" added"
}
```

### Update Icon

```http
PUT /api/icon
Content-Type: application/json

{
  "originalName": "old-name",
  "name": "new-name",
  "svg": "<svg>...</svg>",
  "keepColor": true
}
```

**Parameters:**
- `originalName` (required): Original icon name
- `name` (required): New icon name (can be the same)
- `svg` (required): New SVG code
- `keepColor` (optional): Whether to preserve colors, defaults to `true`

**Response Example:**

```json
{
  "message": "Icon \"old-name\" -> \"new-name\" updated"
}
```

### Delete Icon

```http
DELETE /api/icon
Content-Type: application/json

{
  "name": "icon-name"
}
```

**Parameters:**
- `name` (required): Icon name to delete

**Response Example:**

```json
{
  "message": "Icon \"icon-name\" deleted"
}
```

## Development

```bash
# Clone repository
git clone https://github.com/JeeekXY/iconify-manager.git
cd iconify-manager
```

### Manager

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start --path=./src/iconify.json
```

### Page

```bash
# Navigate to page directory
cd src/page

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## License

MIT License
