import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remult } from 'remult'
import { ManuscriptsList } from '../Manuscripts/ManuscriptsList'
import { Author } from './Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const authorRepo = remult.repo(Author)

export const AuthorShow: React.FC<{}> = () => {
  let params = useParams()
  const [author, setAuthor] = useState<Author>()
  const [loading, setLoading] = useState(true)
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])

  useEffect(() => {
    ;(async () => {
      const author = await authorRepo.findId(params.id!)
      setAuthor(author)
      authorRepo
        .relations(author)
        .manuscripts.find({
          include: {
            manuscript: true
          }
        })
        .then((authorManuscript) => {
          const manuscripts = authorManuscript
            .filter((authorManuscript) => authorManuscript.manuscript)
            .map((authorManuscript) => authorManuscript.manuscript)
          setManuscripts(manuscripts)
        })
      setLoading(false)
    })()
  }, [params.id])

  if (loading) return <span>Loading</span>
  if (!author) return <span>not found</span>

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ width: '100%' }}>
      <Box flex="1">
        <Button
          color="primary"
          component={Link}
          to={'/authors/'}
          sx={{ marginBottom: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Authors
        </Button>
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
                    sx={{ mt: 1 }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography>{author.email}</Typography>
                    <Typography>{author.phoneNumber}</Typography>
                    <Typography>{author.pronouns}</Typography>
                  </Stack>
                  <Divider />
                  <Typography sx={{ mt: 1 }}>{author.address}</Typography>
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
                    sx={{ mt: 1 }}
                  >
                    <Typography>Website: {author.website}</Typography>
                    <Typography>Blog: {author.blog}</Typography>
                    <Typography>Twitter: {author.twitter}</Typography>
                  </Stack>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mt: 1 }}
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
                  <Typography>Bio:</Typography>
                  <div
                    style={{
                      border: ' 1px solid lightGray',
                      borderRadius: '4px',
                      padding: '10px',
                      minHeight: '50px'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: author.bio || ''
                    }}
                  />
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
                  manuscripts={manuscripts}
                  setStatusForManuscript={() => {}}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  )
}
