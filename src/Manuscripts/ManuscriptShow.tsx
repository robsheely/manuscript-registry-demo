import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Link,
  Stack,
  FormControl,
  InputLabel
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { remult, repo } from 'remult'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { ManuscriptNote } from './ManuscriptNote.entity'
import { ManuscriptAside } from './ManuscriptAside'
import { Logo } from '../Authors/Logo'
import { StatusIndicator } from './StatusIndicator'

import { Status } from './Status'
import { Note } from './Note'
import { getValueList } from 'remult'
import { useIsDesktop } from '../utils/useIsDesktop'
import { Author } from '../Authors/Author.entity'

export const ManuscriptShow: React.FC<{}> = () => {
  let params = useParams()
  const [manuscript, setManuscript] = useState<Manuscript>()
  const [author, setAuthor] = useState<Author>()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const manuscript = await repo(Manuscript).findId(params.id!)
      setManuscript(manuscript)
      const author = await repo(Author).findId(manuscript.authorId)
      setAuthor(author)
      setLoading(false)
    })()
  }, [params.id])

  if (loading) return <span>Loading</span>
  if (!manuscript) return <span>not found</span>

  console.log('manuscript:', manuscript)

  return (
    <Box mt={2} display="flex">
      <Box flex="1">
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h4">{manuscript.title}</Typography>
              <Typography>
                <Link component={RouterLink} to={`/authors/${author?.id}`}>
                  {author?.firstName} {author?.lastName}
                </Link>
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <TextField label="Genre" value={manuscript.genre.caption} />
                <TextField label="Age" value={manuscript.ageGroup.caption} />
                <TextField label="Word count" value={manuscript.wordCount} />
              </Stack>
              <TextField
                fullWidth
                label="Target audience"
                value={manuscript.target}
              />
              <TextField fullWidth label="Blurb" value={manuscript.blurb} />
              <TextField
                label="Has been published"
                value={manuscript.published.toString()}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
//[ ] - consider the fact that the tags are already in the client - but they always come in as well
