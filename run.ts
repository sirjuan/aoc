import fs from 'fs'
import path from 'path'
import 'dotenv/config'

await run()

async function run() {
  const arg = process.argv[2]
  const argDay = parseInt(arg, 10)
  const day = isNaN(argDay) ? new Date().getDate() : argDay
  const dir = relativePath('challenges', day.toString())
  if (!fs.existsSync(dir)) {
    copyTemplate(dir, await getInput(day))
  }
  const isExample = typeof arg === 'string'
  const inputFile = ['input', arg].filter(Boolean).join('_') + '.txt'
  const input = fs.readFileSync(path.join(dir, inputFile)).toString('utf-8')
  const { solver, parser = defaultParser } = await import(relativePath(dir, 'solver.ts'))
  solver(parser(input), isExample)
}

function copyFileSync(source: string, target: string) {
  var targetFile = target

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source))
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source))
}

async function copyTemplate(dir: string, data: string) {
  fs.mkdirSync(dir)
  const templateDir = './template'
  const templateFiles = fs.readdirSync(templateDir)
  for (const file of templateFiles) {
    copyFileSync(relativePath(templateDir, file), dir)
  }
  fs.writeFileSync(relativePath('.', dir, 'input.txt'), data)
}

async function getInput(day: number) {
  const session = process.env.SESSION
  if (!session) {
    throw new Error('Missing session')
  }
  const cookie = `session=${session}`
  const url = `https://adventofcode.com/2023/day/${day}/input`
  const response = await fetch(url, { headers: { cookie } })
  return response.text()
}

function defaultParser(inputStr: string) {
  return inputStr.trim()
}

function relativePath(...paths: string[]) {
  return `./${path.join(...paths)}`
}
