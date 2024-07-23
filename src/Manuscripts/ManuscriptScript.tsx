import { Box, Card, CardContent, Typography, Divider } from '@mui/material'
import React from 'react'
import { Manuscript } from './Manuscript.entity'
import ScriptDisplay from './ScriptDisplay'

type Props = {
  manuscript: Manuscript
}

export const ManuscriptScript: React.FC<Props> = ({ manuscript }: Props) => {
  return (
    <Box mt={2} display="flex">
      <Box flex="1">
        <Card>
          <CardContent>
            <Typography variant="h4">Manuscript</Typography>
            <Divider />
            <ScriptDisplay file={manuscript.script} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
