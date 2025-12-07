#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import { IconSet, SVG, cleanupSVG, parseColors, runSVGO, mergeIconSets } from "@iconify/tools"
import minimist from "minimist"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const argv = minimist(process.argv.slice(2), {
  string: ["path", "port"],
  default: {
    port: 7770,
  },
})

if (!argv.path) {
  console.error(
    "Error: --path parameter is required to specify the IconifyJSON file path"
  )
  process.exit(1)
}

const PORT = +argv.port
const ICONIFY_FILE = path.resolve(argv.path)
const PAGE_DIR = path.resolve(__dirname, "page/dist")

if (Number.isNaN(PORT)) {
  console.error("Error: --port parameter must be a number")
  process.exit(1)
}

if (PORT < 1 || PORT > 65535) {
  console.error("Error: --port parameter must be between 1 and 65535")
  process.exit(1)
}

if (!fs.existsSync(ICONIFY_FILE)) {
  console.error(`Error: IconifyJSON file not found: ${ICONIFY_FILE}`)
  process.exit(1)
}

function loadIconSet(json) {
  let iconifyJson = json
  if (!iconifyJson) {
    try {
      iconifyJson = fs.readFileSync(ICONIFY_FILE, "utf-8")
    } catch (e) {
      console.error(`Error: Failed to load and parse IconifyJSON file: ${ICONIFY_FILE}`)
      console.error(e)
    }
  }
  try {
    const data = JSON.parse(iconifyJson)
    return new IconSet(data)
  } catch (e) {
    console.error('Error: Failed to parse IconifyJSON')
    console.error(e)
  }
}

async function processSvg(svgString, keepColor) {
  const svg = new SVG(svgString)
  await cleanupSVG(svg)
  if (keepColor === false) {
    parseColors(svg, {
      defaultColor: "currentColor",
      callback: () => {
        return "currentColor"
      },
    })
  }

  await runSVGO(svg)
  return svg
}

function saveIconSet(iconSet) {
  fs.writeFileSync(
    ICONIFY_FILE,
    `${JSON.stringify(iconSet.export(), null, 2)}\n`,
    "utf-8"
  )
}

const app = express()
app.disable("x-powered-by")
app.use(express.json({ limit: "100mb" }))
app.use("/iconify-viewer", express.static(PAGE_DIR))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  if (req.method === "OPTIONS") {
    res.status(204).end()
    return
  }
  next()
})

app.post("/api/icon", async (req, res) => {
  try {
    const { name, svg, keepColor = true } = req.body || {}

    console.log(`Icon "${name}" adding...`)

    if (!name || !svg) {
      res.status(400).json({ message: "name and svg fields are required" })
      return
    }
    const iconSet = loadIconSet()
    if (iconSet.exists(name)) {
      res.status(400).json({
        message: `Icon "${name}" already exists, please use a different name`,
      })
      return
    }
    const processedSvg = await processSvg(svg, keepColor)
    iconSet.fromSVG(name, processedSvg)
    saveIconSet(iconSet)

    console.log(`Icon "${name}" added!`)

    res.status(200).json({
      message: `Icon "${name}" added`,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.put("/api/icon", async (req, res) => {
  try {
    const { originalName, name, svg, keepColor = true } = req.body || {}

    console.log(`Icon "${originalName}" -> "${name}" updating...`)

    if (!originalName || !name || !svg) {
      res
        .status(400)
        .json({ message: "originalName, name and svg fields are required" })
      return
    }
    const iconSet = loadIconSet()
    if (!iconSet.exists(originalName)) {
      res.status(400).json({ message: `Icon "${originalName}" not found` })
      return
    }
    const processedSvg = await processSvg(svg, keepColor)
    iconSet.fromSVG(originalName, processedSvg)
    if (originalName !== name) {
      iconSet.rename(originalName, name)
    }
    saveIconSet(iconSet)

    console.log(`Icon "${originalName}" -> "${name}" updated!`)

    res.status(200).json({
      message: `Icon "${originalName}" -> "${name}" updated`,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.delete("/api/icon", async (req, res) => {
  try {
    const { name } = req.body || {}

    console.log(`Icon "${name}" deleting...`)

    if (!name) {
      res.status(400).json({ message: "name field is required" })
      return
    }
    const iconSet = loadIconSet()
    if (!iconSet.exists(name)) {
      res.status(400).json({ message: `Icon "${name}" not found` })
      return
    }
    iconSet.remove(name)
    saveIconSet(iconSet)

    console.log(`Icon "${name}" deleted!`)

    res.status(200).json({
      message: `Icon "${name}" deleted`,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.get("/api/icons", async (_, res) => {
  try {
    const iconSet = loadIconSet()
    const iconNames = iconSet.list()
    const icons = iconNames.map((name) => {
      const svg = iconSet.toSVG(name)
      return {
        name: name,
        svg: svg.toPrettyString(),
      }
    })
    res.status(200).json(icons)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.post("/api/icon/merge", async (req, res) => {
  try {
    const { iconifyJSON } = req.body || {}

    console.log(`Iconset merging...`)

    const iconSet = loadIconSet()
    const newIconSet = loadIconSet(iconifyJSON)
    const mergedIconSet = mergeIconSets(iconSet, newIconSet)
    saveIconSet(mergedIconSet)

    console.log(`Iconset merged!`)

    res.status(200).json({
      message: "Iconset merged",
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.listen(PORT, () => {
  console.log(`Iconify Manager is running on http://localhost:${PORT}`)
  console.log(`You can visit the web interface at http://localhost:${PORT}/iconify-viewer/`)
})
