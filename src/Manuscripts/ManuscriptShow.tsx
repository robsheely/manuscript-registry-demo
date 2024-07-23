import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Link,
  Stack,
  Button,
  Divider,
  Tab
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { repo } from 'remult'
import { Manuscript } from './Manuscript.entity'
import { ManuscriptNote } from './ManuscriptNote.entity'
import { Author } from '../Authors/Author.entity'
import ScriptDisplay from './ScriptDisplay'
import { Note } from './Note'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { ManuscriptDetails } from './ManuscriptDetails'
import { ManuscriptScript } from './ManuscriptScript'
import { ManuscriptNotes } from './ManuscriptNotes'

export const ManuscriptShow: React.FC<{}> = () => {
  let params = useParams()
  const [manuscript, setManuscript] = useState<Manuscript>()
  const [author, setAuthor] = useState<Author>()
  const [notes, setNotes] = useState<ManuscriptNote[]>([])

  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState(new ManuscriptNote())
  const [currentTab, setCurrentTab] = React.useState('1')

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }

  const submitNewNote = async () => {
    const submittedNote = await repo(Manuscript)
      .relations(manuscript!)
      .notes.insert(newNote)
    setNotes([submittedNote, ...notes])
    setNewNote(new ManuscriptNote())
  }

  useEffect(() => {
    ;(async () => {
      const manuscript = await repo(Manuscript).findId(params.id!, {
        include: {
          notes: true
        }
      })
      setManuscript(manuscript)
      if (manuscript) {
        setNotes(manuscript.notes!)
      }
      const author = await repo(Author).findId(manuscript.authorId)
      setAuthor(author)
      setLoading(false)
    })()
  }, [params.id])

  if (loading) return <span>Loading</span>
  if (!manuscript) return <span>not found</span>

  return (
    <Box mt={2} display="flex">
      <Box flex="1">
        <Typography variant="h4">{manuscript.title}</Typography>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={currentTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Details" value="1" />
                <Tab label="Manuscript" value="2" />
                <Tab label="Notes" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <ManuscriptDetails manuscript={manuscript} author={author} />
            </TabPanel>
            <TabPanel value="2">
              <ManuscriptScript manuscript={manuscript} />
            </TabPanel>
            <TabPanel value="3">
              <ManuscriptNotes manuscript={manuscript} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Box>
  )

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
              <TextField
                multiline
                fullWidth
                label="Blurb"
                value={manuscript.blurb}
              />
              <TextField
                label="Has been published"
                value={manuscript.published.toString()}
              />
              <Typography variant="h4">Notes</Typography>
              <Divider />
              <Box mt={2}>
                <TextField
                  label="Add a note"
                  size="small"
                  fullWidth
                  multiline
                  value={newNote.text}
                  variant="filled"
                  onChange={(e: any) =>
                    setNewNote({ ...newNote, text: e.target.value })
                  }
                  rows={3}
                />

                <Box mt={1} display="flex">
                  <Stack direction="row-reverse" spacing={1} flex={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!newNote.text || loading}
                      onClick={() => submitNewNote()}
                    >
                      Add this note
                    </Button>
                  </Stack>
                </Box>
              </Box>
              <Divider />

              {notes.map((note) => (
                <Box key={note.id} mt={2}>
                  {note.createdAt.toLocaleString()}
                  <Note
                    note={note}
                    onDelete={(note) =>
                      setNotes(notes.filter((n) => n !== note))
                    }
                  />
                </Box>
              ))}
              <ScriptDisplay file={manuscript.script} />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
//[ ] - consider the fact that the tags are already in the client - but they always come in as well
