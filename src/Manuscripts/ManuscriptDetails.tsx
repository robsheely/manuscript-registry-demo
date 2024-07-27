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
  author?: Author
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
            <Stack spacing={2}>
              <div style={{ textAlign: 'center', marginBottom: 3 }}>
                <Typography variant="h6">
                  <Link component={RouterLink} to={`/authors/${author?.id}`}>
                    {`By ${author?.firstName} ${author?.lastName}`}
                  </Link>
                </Typography>
              </div>
              <Stack
                direction={{ sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <TextField
                  sx={{ flexGrow: 5 }}
                  label="Genre"
                  value={manuscript.genre.caption}
                />
                <TextField label="Age" value={manuscript.ageGroup.caption} />
                <TextField label="Word count" value={manuscript.wordCount} />
              </Stack>
              <TextField
                fullWidth
                label="Target audience"
                value={manuscript.target}
              />
              <TextField label="Pitch" value={manuscript.pitch} />
              <Typography>Blurb:</Typography>
              <div
                style={{
                  border: ' 1px solid lightGray',
                  borderRadius: '4px',
                  padding: '10px'
                }}
                dangerouslySetInnerHTML={{ __html: manuscript.blurb }}
              />
              <Typography>Comparable titles:</Typography>
              <div
                style={{
                  border: ' 1px solid lightGray',
                  borderRadius: '4px',
                  padding: '10px',
                  minHeight: '50px'
                }}
                dangerouslySetInnerHTML={{ __html: manuscript.comps }}
              />
              <Typography>Synopsis:</Typography>
              <div
                style={{
                  border: ' 1px solid lightGray',
                  borderRadius: '4px',
                  padding: '10px',
                  minHeight: '50px'
                }}
                dangerouslySetInnerHTML={{ __html: manuscript.synopsis || '' }}
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
