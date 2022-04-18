import { BackendApplicationParams } from './config/BackendApplicationParams'
import { BackendApplication } from './main'
import { config } from 'dotenv'

config()
const app = new BackendApplication()
app.init(new BackendApplicationParams({})).then(() =>
  app.start().then(() => {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV === 'production') {
      // this has to be a warn level to avoid breaking log redirections like azure appinsight
      console.warn('backend started')
    }
  })
)
