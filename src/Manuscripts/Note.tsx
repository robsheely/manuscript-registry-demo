import { Card, CardContent, Typography } from '@mui/material'
import { ManuscriptNote } from './ManuscriptNote.entity'

export const Note: React.FC<{
  note: ManuscriptNote
}> = ({ note }) => {
  return (
    <Card sx={{ backgroundColor: '#edf3f0', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="body1" flex={1} whiteSpace="pre-line">
          {note.text}
        </Typography>
      </CardContent>
    </Card>
  )
}
