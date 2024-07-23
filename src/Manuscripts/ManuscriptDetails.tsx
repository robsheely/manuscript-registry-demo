import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Link,
  Stack,
  Divider
} from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Manuscript } from './Manuscript.entity'
import { Author } from '../Authors/Author.entity'

type Props = {
  manuscript: Manuscript
  author: Author
}

export const ManuscriptDetails: React.FC<Props> = ({
  manuscript,
  author
}: Props) => {
  return (
    <Box mt={2} display="flex">
      <Box flex="1">
        <Card>
          <CardContent>
            <Typography variant="h4">Details</Typography>
            <Divider sx={{ marginBottom: 3 }} />
            <Stack spacing={2}>
              <Typography variant="h6">
                <Link component={RouterLink} to={`/authors/${author?.id}`}>
                  {`By ${author?.firstName} ${author?.lastName}`}
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
              <TextField
                multiline
                fullWidth
                label="Blurb"
                value={manuscript.blurb}
              />
              <TextField
                value={
                  manuscript.published
                    ? 'This manuscript has been published.'
                    : 'This manuscript has not been published.'
                }
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
