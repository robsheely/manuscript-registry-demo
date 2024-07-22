import express from 'express'
import compression from 'compression'
import session from 'cookie-session'
import sslRedirect from 'heroku-ssl-redirect'
import swaggerUi from 'swagger-ui-express'
import { api, entities } from './api'
import { auth } from './auth'
import { remult } from 'remult'
import { remultGraphql } from 'remult/graphql'
import { createSchema, createYoga } from 'graphql-yoga'

const app = express()
app.use(sslRedirect())
//app.use(helmet({ contentSecurityPolicy: false,crossOriginResourcePolicy:false }));//removed because avatar image urls point to a different website
app.use(compression())

app.use(
  '/api',
  session({ secret: process.env['TOKEN_SIGN_KEY'] || 'my secret' })
)
app.use(auth)

app.get('/api/test', (_req, res) => res.send('ok'))
//@ts-ignore
app.use(api)

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(api.openApiDoc({ title: 'remult-react-todo' }))
)

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, 'uploads/')
//   },
//   filename: (_req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname)
//   }
// })

// // Create the multer instance
// const upload = multer({ storage: storage })

// // Set up a route for file uploads
// app.post('/upload', upload.single('file'), (_req, res) => {
//   // Handle the uploaded file
//   res.json({ message: 'File uploaded successfully!' })
// })

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
  remult.user = { id: 'admin', avatar: '' } //this is a hack to make sure the admin user is logged in
  yoga(req, res)
})

app.use(express.static('dist'))

app.use('/*', async (_req, res) => {
  res.sendFile(process.cwd() + '/dist/index.html')
})

app.listen(process.env.PORT || 3002, () => console.log('Server started'))
