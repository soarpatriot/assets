
import log4js from 'koa-log4'
// import log4js from 'log4js'
import logConfig from '../log.json'
log4js.configure(logConfig)
const logger = log4js.getLogger('app')

export default  logger
