import { Box, Card, CardContent } from '@mui/material'
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
            <ScriptDisplay file={manuscript.script} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
