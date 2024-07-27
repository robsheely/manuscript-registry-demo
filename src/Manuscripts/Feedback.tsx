import { Card, CardContent, Typography } from '@mui/material'
import { ManuscriptFeedback } from './ManuscriptFeedback.entity'

export const Feedback: React.FC<{
  feedback: ManuscriptFeedback
}> = ({ feedback }) => {
  return (
    <Card sx={{ backgroundColor: '#edf3f0', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="body1" flex={1} whiteSpace="pre-line">
          {feedback.text}
        </Typography>
      </CardContent>
    </Card>
  )
}
