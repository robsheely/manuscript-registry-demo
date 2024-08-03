import express from 'express'
import session from 'express-session'
import compression from 'compression'
import sslRedirect from 'heroku-ssl-redirect'
import swaggerUi from 'swagger-ui-express'
import { api, entities } from './api'
import { remult } from 'remult'
import { remultGraphql } from 'remult/graphql'
import { createSchema, createYoga } from 'graphql-yoga'
import auth from './auth'

const app = express()
app.use(sslRedirect())
//app.use(helmet({ contentSecurityPolicy: false,crossOriginResourcePolicy:false }));//removed because avatar image urls point to a different website
app.use(compression())

const sessionInstance = session({
  // this should be changed to something cryptographically secure for production
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // automatically extends the session age on each request. useful if you want
  // the user's activity to extend their session. If you want an absolute session
  // expiration, set to false
  rolling: true,
  name: 'sid', // don't use the default session cookie name
  // set your options for the session cookie
  cookie: {
    httpOnly: true,
    // the duration in milliseconds that the cookie is valid
    maxAge: 20 * 60 * 1000, // 20 minutes
    // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
    // domain: 'your.domain.com',
    // recommended you use this setting in production if your site is published using HTTPS
    // secure: true,
  }
})
app.use(sessionInstance)

app.use('/api', sessionInstance)
auth(app)

app.get('/api/test', (_req, res) => res.send('ok'))
//@ts-ignore
app.use(api)

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(api.openApiDoc({ title: 'remult-react-todo' }))
)

// var bodyParser = require('body-parser')
// app.use(bodyParser.json({ limit: '50mb' }))
// app.use(
//   bodyParser.urlencoded({
//     limit: '50mb',
//     extended: true,
//     parameterLimit: 50000
//   })
// )

const { typeDefs, resolvers } = remultGraphql({
  entities,
  removeComments: true
})

const yoga = createYoga({
  graphqlEndpoint: '/api/graphql',
  schema: createSchema({
    typeDefs,
    resolvers
  })
})

app.use(yoga.graphqlEndpoint, api.withRemult, (req, res) => {
  remult.user = { id: 'admin' } //this is a hack to make sure the admin user is logged in
  yoga(req, res)
})

app.use(express.static('dist'))

app.use('/*', async (_req, res) => {
  res.sendFile(process.cwd() + '/dist/index.html')
})

app.listen(process.env.PORT || 3002, () => console.log('BE Server started'))
app.listen(5173, () => console.log(' FE Server started'))
