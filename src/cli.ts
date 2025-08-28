import cac from 'cac'
import { loadConfig, no, ok, saveConfig, search } from '.'
import { Config } from './types'
import { exec } from 'child_process'
import prompts from 'prompts'
import path from 'path'

const cli = cac('breeze-open-cli')

cli
  .command('open <...args>', 'target folder or file')
  .option('-e', 'open with explorer. default use vscode')
  .action(async (args: string[], options) => {
    switch (args.length) {
      case 1:
        const keyword = args[0]
        const { totalResults, results } = await search(keyword)
        if (totalResults < 1) {
          console.log(`file(${args[0]}) does not exist.`)
          process.exit(1)
        }
        if (totalResults == 1) {
          if (options.e) {
            exec(
              `explorer "${path.resolve(results[0].path, results[0].name)}"`
            ).unref()
          } else {
            exec(
              `code "${path.resolve(results[0].path, results[0].name)}"`
            ).unref()
          }
        } else {
          const choose = await prompts({
            type: 'select',
            name: 'folder',
            message: `Multiple results found for "${keyword}". Please choose:`,
            choices: results.map((f: any, i: number) => ({
              title: `${i + 1}. ${
                f.type === 'folder' ? '🗂️  ' + f.name : '📑 ' + f.name
              }`,
              description: f.path,
              value: path.resolve(f.path, f.name)
            }))
          })
          if (choose.folder) {
            if (options.e) {
              exec(`explorer "${choose.folder}"`).unref()
            } else {
              exec(`code "${choose.folder}"`).unref()
            }
          }
        }
        break
      case 2:
        const config = loadConfig()
        console.log(JSON.stringify(config))
        break
      case 3:
        const cfg = loadConfig()
        const key = args[2]
        if (Object.hasOwn(cfg, key)) {
          ok(cfg[key as keyof Config])
        } else {
          no(`key(${args[2]}) doest not exist`)
        }
        break
      case 4:
        const k = args[2]
        const v = args[3]
        const c = loadConfig()
        if (Object.hasOwn(c, k)) {
          // @ts-ignore
          c[k] = v
          saveConfig(c)
        } else {
          no(`Invalid Key(${k})`)
        }
        break
    }
  })
cli.usage(`
  open <folder>                   open target folder with vscode
  open config list                list config file info
  open config get <key>           get config value by key
  open config set <key> <value>   set config key value
`)

cli.help()
cli.parse()

