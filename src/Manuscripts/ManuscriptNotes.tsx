import {
  Box,
  Card,
  CardContent,
  TextField,
  Stack,
  Button,
  Divider
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { repo } from 'remult'
import { Manuscript } from './Manuscript.entity'
import { ManuscriptNote } from './ManuscriptNote.entity'
import { Note } from './Note'

type Props = {
  manuscript: Manuscript
}

export const ManuscriptNotes: React.FC<Props> = ({ manuscript }: Props) => {
  const [newNote, setNewNote] = useState(new ManuscriptNote())
  const [notes, setNotes] = useState<ManuscriptNote[]>([])

  useEffect(() => {
    if (manuscript && manuscript.notes) {
      setNotes(manuscript.notes)
    }
  }, [manuscript])

  const submitNewNote = async () => {
    setNotes([newNote, ...notes])
    await repo(Manuscript).relations(manuscript!).notes.insert(newNote)
    setNewNote(new ManuscriptNote())
  }

  return (
    <Box mt={2} display="flex">
      <Box flex="1">
        <Card>
          <CardContent>
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
                    disabled={!newNote.text}
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
                <Note note={note} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
//[ ] - consider the fact that the tags are already in the client - but they always come in as well
