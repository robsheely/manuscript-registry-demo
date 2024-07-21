import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { remult } from 'remult'
import { ManuscriptsList } from '../Manuscripts/ManuscriptsList'
import { Author } from './Author.entity'

export const AuthorShow: React.FC<{}> = () => {
  let params = useParams()
  const [author, setAuthor] = useState<Author>()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const author = await remult.repo(Author).findId(params.id!)
      setAuthor(author)
      setLoading(false)
    })()
  }, [params.id])

  if (loading) return <span>Loading</span>
  if (!author) return <span>not found</span>

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }}>
      <Box flex="1">
        <Stack spacing={5}>
          <Card>
            <CardContent>
              <Stack direction="row">
                <Stack sx={{ ml: 1 }} alignItems="flex-start">
                  <Typography variant="h5">
                    {author.firstName + ' ' + author.lastName}
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography>{author.email}</Typography>
                    <Typography>{author.phoneNumber}</Typography>
                    <Typography>{author.pronouns}</Typography>
                  </Stack>
                  <Divider />
                  <Typography>{author.address}</Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography>{author.city}</Typography>
                    <Typography>{author.stateAbbr}</Typography>
                    <Typography>{author.zipcode}</Typography>
                  </Stack>
                  <Divider />
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography>Website: {author.website}</Typography>
                    <Typography>Blog: {author.blog}</Typography>
                    <Typography>Twitter: {author.twitter}</Typography>
                  </Stack>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography>{`${
                      author.published ? 'Has' : "hasn't"
                    } been published before.`}</Typography>
                    <Typography>{`${
                      author.published ? 'Has' : "hasn't"
                    } had an agent before${
                      author.published ? ': ' : '.'
                    }`}</Typography>
                    {!!author.formerAgent && (
                      <Typography>{author.formerAgent}</Typography>
                    )}
                  </Stack>
                  <Typography>Bio: {author.bio}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
        <Card>
          <CardContent>
            <Stack spacing={5}>
              <Typography variant="h5">Manuscripts:</Typography>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <ManuscriptsList
                  manuscripts={author.manuscripts}
                  loading={false}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  )
}
