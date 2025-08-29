import cac from 'cac'
import { isConfigKey, loadConfig, no, ok, saveConfig, search } from '.'
import { exec } from 'child_process'
import prompts from 'prompts'
import path from 'path'

const cli = cac('open')

cli
  .command('[folder]', 'target folder or file')
  .option('-e', 'open with explorer. default use vscode')
  .action(async (folder: string, options) => {
    if (!folder) {
      cli.outputHelp()
      process.exit(0)
    }
    let offset = 0
    let selected: string | null = null
    const mode = options.e ? 'explorer' : 'code'
    const { totalResults, results } = await search(folder)
    if (totalResults < 1) {
      console.log(`file(${folder}) does not exist.`)
      process.exit(0)
    }
    if (totalResults == 1) {
      exec(
        `${mode} "${path.resolve(results[0].path, results[0].name)}"`
      ).unref()
    } else {
      do {
        const slice = results.slice(offset, offset + 5)
        const choices = slice.map((f: any, i: number) => ({
          title: `${i + 1}. ${
            f.type === 'folder' ? '🗂️  ' + f.name : '📑 ' + f.name
          }`,
          description: f.path,
          value: path.resolve(f.path, f.name)
        }))
        if (offset + 5 < results.length) {
          choices.push({
            title: '👉 More...',
            value: '__MORE__',
            description: 'See More...'
          })
        }
        const choose = await prompts({
          type: 'select',
          name: 'folder',
          message: `Multiple results found for "${folder}". Please choose:`,
          choices
        })
        if (choose.folder === '__MORE__') {
          offset += 5
          continue
        }
        if (choose.folder) {
          selected = choose.folder
        } else {
          process.exit(1)
        }
      } while (!selected)
      if (selected) {
        exec(`${mode} "${selected}"`).unref()
      }
    }
  })
cli
  .command('config [...args]', 'manage config file')
  .action((args: string[], options) => {
    const action = args[0]
    const k = args[1]
    const v = args[2]
    const config = loadConfig()
    if (action && action === 'set' && k && isConfigKey(k) && v) {
      // @ts-ignore
      config[k] = v
      saveConfig(config)
      process.exit(0)
    }
    if (action && action === 'get' && k) {
      // @ts-ignore
      ok(config[k])
      process.exit(0)
    }
    if (action && action === 'list') {
      console.log('Config Info:')
      console.table(config)
      process.exit(0)
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

