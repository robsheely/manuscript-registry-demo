import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { remult } from 'remult'
import { Manuscript } from './Manuscript.entity'

import { ManuscriptsList } from './ManuscriptsList'
import {
  ManuscriptFilterState,
  ManuscriptFilterEdit
} from './ManuscriptFilterEdit'

const amRepo = remult.repo(Manuscript)

const initialFilterState = {
  title: '',
  author: '',
  genres: [],
  ageGroups: [],
  minWordCount: 0,
  maxWordCount: 0
}

export const ManuscriptsPage: React.FC<{}> = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilterDialog, setShowFilterDialog] = useState(false)

  const [filterState, setFilterState] =
    useState<ManuscriptFilterState>(initialFilterState)

  const page = 0
  const rowsPerPage = 100

  const manuscriptsQuery = useMemo(() => {
    const query = amRepo.query({
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
        const manuscripts = await manuscriptsQuery.getPage(page)
        if (ref === fetchRef.current) setManuscripts(manuscripts)
      } finally {
        if (ref === fetchRef.current) setLoading(false)
      }
    })()
  }, [manuscriptsQuery, page])

  const handleFiltersSaved = (filters: ManuscriptFilterState) => {
    setFilterState(filters)
    setShowFilterDialog(false)
  }

  const filteredManuscripts = manuscripts.filter((manuscript) => {
    return (
      (!filterState.title || manuscript.title.includes(filterState.title)) &&
      (!filterState.author ||
        `${manuscript.author?.firstName} ${manuscript.author?.lastName}`.includes(
          filterState.author
        )) &&
      (!filterState.genres.length ||
        filterState.genres.some((genre) => manuscript.genre.id === genre.id)) &&
      (!filterState.ageGroups.length ||
        filterState.ageGroups.some(
          (ageGroup) => manuscript.ageGroup.id === ageGroup.id
        )) &&
      (!filterState.minWordCount ||
        manuscript.wordCount >= filterState.minWordCount) &&
      (!filterState.maxWordCount ||
        manuscript.wordCount <= filterState.maxWordCount)
    )
  })

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Typography
        variant="h4"
        sx={{
          color: 'rgb(25, 118, 210)',
          filter: 'drop-shadow(3px 3px 4px #AAAAAA)',
          fontWeight: 'bold'
        }}
      >
        MANUSCRIPTS
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
          <Box
            display="flex"
            justifyContent="flex-end"
            style={{ marginBottom: '20px' }}
          >
            <Button
              variant="contained"
              onClick={() => setShowFilterDialog(true)}
            >
              Filter Manuscripts
            </Button>
          </Box>

          <ManuscriptsList manuscripts={filteredManuscripts} />
          {showFilterDialog && (
            <ManuscriptFilterEdit
              state={filterState}
              onClose={() => setShowFilterDialog(false)}
              onSaved={handleFiltersSaved}
            />
          )}
        </div>
      )}
    </div>
  )
}
