import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { remult } from 'remult'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { ManuscriptsList } from '../Manuscripts/ManuscriptsList'
import { Author } from './Author.entity'
import { AuthorAside } from './AuthorAside'
import { Logo } from './Logo'

export const AuthorShow: React.FC<{}> = () => {
  let params = useParams()
  const [author, setAuthor] = useState<Author>()
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const author = await remult.repo(Author).findId(params.id!, {
        include: {
          accountManager: true,
          manuscripts: {
            include: {
              tags: true
            }
          }
        }
      })
      setAuthor(author)
      setLoading(false)
      if (author) {
        setManuscripts(author.manuscripts!)
      }
    })()
  }, [params.id])
  if (loading) return <span>Loading</span>
  if (!author) return <span>not found</span>
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }}>
      <Box flex="1">
        <Card>
          <CardContent>
            <Stack>
              <Stack direction="row">
                <Logo url={author.logo} title={author.name} sizeInPixels={42} />
                <Stack sx={{ ml: 1 }} alignItems="flex-start">
                  <Typography variant="h5">{author.name}</Typography>
                  <Typography variant="body1">
                    {author.sector}, {author.size?.caption}
                  </Typography>
                </Stack>
              </Stack>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <ManuscriptsList
                  manuscripts={manuscripts}
                  setManuscripts={setManuscripts}
                  defaultAuthor={author}
                  loading={false}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <AuthorAside author={author} setAuthor={setAuthor}></AuthorAside>
    </Stack>
  )
}
