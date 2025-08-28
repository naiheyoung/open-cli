import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { Config } from './types'
import axios from 'axios'

const CONFIG_NAME = '.breeze-open-cli.json'
const CONFIG_PATH = path.join(os.homedir(), CONFIG_NAME)
const CONFIGFILEFIELD = {
  username: '',
  password: '',
  serverUrl: '',
  limit: 5
}

export async function hello(name: string) {
  const spinner = ora(`Resolving ${name}...`).start()
  spinner.color = 'magenta'
  await new Promise(resolve => setTimeout(resolve, 3000))
  spinner.succeed(chalk.green(`Hello, ${name}!`))
}

/**
 * 加载配置文件
 */
export function loadConfig(): Config {
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIGFILEFIELD, null, 2))
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
}

/**
 * 保存配置
 */
export function saveConfig(config: Config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}

export function ok(...text: any) {
  console.log(chalk.green(text))
}

export function no(...text: any) {
  console.log(chalk.red(text))
}

export async function search(folder: string) {
  const config = loadConfig()
  if (
    config.username == '' ||
    config.password == '' ||
    config.serverUrl == ''
  ) {
    no(
      'Please configure the file service address and username and password first.'
    )
    process.exit(1)
  }
  const searchResult = await axios.get(
    `http://${config.username}:${config.password}@${config.serverUrl}/`,
    {
      params: {
        search: folder,
        json: 1,
        path_column: 1,
        c: config.limit || 5
      }
    }
  )
  if (searchResult.status !== 200) {
    no('Oops! the file service appears to be down.')
    process.exit(1)
  }
  return searchResult.data
}

