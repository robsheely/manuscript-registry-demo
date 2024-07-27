import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { remult } from 'remult'
import { Manuscript } from './Manuscript.entity'

import { ManuscriptsList } from './ManuscriptsList'

const manuscriptRepo = remult.repo(Manuscript)

export const CollaborationsPage: React.FC<{}> = () => {
  const [collaborations, setCollaborations] = useState<Manuscript[]>([])
  const [loading, setLoading] = useState(false)

  const page = 0
  const rowsPerPage = 100

  const collaborationsQuery = useMemo(() => {
    const query = manuscriptRepo.query({
      include: {
        author: true
      },
      pageSize: rowsPerPage
    })
    return query
  }, [rowsPerPage])

  const fetchRef = useRef(0)
  useEffect(() => {
    ;(async () => {
      const ref = ++fetchRef.current
      try {
        setLoading(true)
        const manuscripts = await collaborationsQuery.getPage(page)
        if (ref === fetchRef.current) setCollaborations(manuscripts)
      } finally {
        if (ref === fetchRef.current) setLoading(false)
      }
    })()
  }, [collaborationsQuery, page])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Typography
        variant="h4"
        color="primary"
        sx={{
          filter: 'drop-shadow(3px 3px 4px #AAAAAA)',
          fontWeight: 'bold'
        }}
      >
        COLLABORATIONS
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: 30
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div style={{ padding: '20px' }}>
          <ManuscriptsList manuscripts={collaborations} />
        </div>
      )}
    </div>
  )
}
