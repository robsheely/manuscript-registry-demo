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
import { ManuscriptFeedback } from './ManuscriptFeedback.entity'
import { Feedback } from './Feedback'

type Props = {
  manuscript: Manuscript
}

export const ManuscriptFeedbackList: React.FC<Props> = ({
  manuscript
}: Props) => {
  const [newFeedback, setNewFeedback] = useState(new ManuscriptFeedback())
  const [feedbackList, setFeedbackList] = useState<ManuscriptFeedback[]>([])

  useEffect(() => {
    if (manuscript && manuscript.feedback) {
      setFeedbackList(manuscript.feedback)
    }
  }, [manuscript])

  const submitNewNote = async () => {
    setFeedbackList([newFeedback, ...feedbackList])
    await repo(Manuscript).relations(manuscript!).feedback.insert(newFeedback)
    setNewFeedback(new ManuscriptFeedback())
  }

  return (
    <Box mt={2} display="flex">
      <Box flex="1">
        <Card>
          <CardContent>
            <Box mt={2}>
              <TextField
                label="Add some feedback"
                size="small"
                fullWidth
                multiline
                value={newFeedback.text}
                variant="filled"
                onChange={(e: any) =>
                  setNewFeedback({ ...newFeedback, text: e.target.value })
                }
                rows={3}
              />

              <Box mt={1} display="flex">
                <Stack direction="row-reverse" spacing={1} flex={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!newFeedback.text}
                    onClick={() => submitNewNote()}
                  >
                    Add this feedback
                  </Button>
                </Stack>
              </Box>
            </Box>
            <Divider />

            {feedbackList.map((feedback) => (
              <Box key={feedback.id} mt={2}>
                {feedback.createdAt.toLocaleString()}
                <Feedback feedback={feedback} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
//[ ] - consider the fact that the tags are already in the client - but they always come in as well
