import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import { setExample } from './shared/utils'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

await run()

async function run() {
  const args = yargs(hideBin(process.argv)).parse()

  const currentYear = new Date().getFullYear()
  const year = args.year == null ? currentYear : args.year
  const day = args.day == null ? new Date().getDate() : args.day
  const command = typeof args._[0] === 'string' ? args._[0] : ''

  const yearPart = year === currentYear ? 'challenges' : year.toString()
  const dir = relativePath(yearPart, day.toString())
  if (!fs.existsSync(dir)) {
    copyTemplate(dir, await fetchInput(day, year))
  }
  const isExample = command?.startsWith('example') ?? false

  if (isExample) {
    setExample()
  }

  const inputFile = ['input', command].filter(Boolean).join('_') + '.txt'
  const input = fs.readFileSync(path.join(dir, inputFile)).toString('utf-8')
  const { solver, solver1, solver2, parser = defaultParser } = await import(relativePath(dir, 'solver.ts'))
  const parsedInput = parser(input)
  const solvers = [solver, solver1, solver2].filter((s) => typeof s === 'function')

  solvers.forEach((s, index) => {
    const msg = solvers.length > 0 ? `Part ${index + 1}` : 'Solution'
    console.time(msg)
    s(parsedInput, isExample)
    console.timeEnd(msg)
  })
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

async function fetchInput(day: number, year: number) {
  const session = process.env.SESSION
  if (!session) {
    throw new Error('Missing session')
  }
  const cookie = `session=${session}`
  const url = `https://adventofcode.com/${year}/day/${day}/input`
  const response = await fetch(url, { headers: { cookie } })
  return response.text()
}

function defaultParser(inputStr: string) {
  return inputStr.trim()
}

function relativePath(...paths: string[]) {
  return `./${path.join(...paths)}`
}
