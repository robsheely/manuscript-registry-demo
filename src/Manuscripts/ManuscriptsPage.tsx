import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { remult } from 'remult'
import { Manuscript } from './Manuscript.entity'

import { ManuscriptsList } from './ManuscriptsList'
import {
  ManuscriptFilterState,
  ManuscriptFilterEdit
} from './ManuscriptFilterEdit'
import { StatusFilter } from './StatusFilter'

const manuscriptRepo = remult.repo(Manuscript)

const initialFilterState = {
  title: '',
  author: '',
  genres: [],
  ageGroups: [],
  minWordCount: 0,
  maxWordCount: 0,
  status: StatusFilter.all
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

  const handleSetStatusForManuscript = async (
    manuscript: Manuscript,
    status: StatusFilter
  ) => {
    const newMan = await manuscriptRepo.update(manuscript, { status })
    setManuscripts((manuscripts) => {
      const index = manuscripts.findIndex((m) => m.id === newMan.id)
      if (index === -1) return manuscripts
      return [
        ...manuscripts.slice(0, index),
        newMan,
        ...manuscripts.slice(index + 1)
      ]
    })
  }

  const filteredManuscripts = manuscripts.filter((manuscript) => {
    return (
      (!filterState.title || manuscript.title.includes(filterState.title)) &&
      (!filterState.author ||
        `${manuscript.author?.firstName} ${manuscript.author?.lastName}`
          .toLowerCase()
          .includes(filterState.author.toLowerCase())) &&
      (!filterState.genres.length ||
        filterState.genres.some((genre) => manuscript.genre.id === genre.id)) &&
      (!filterState.ageGroups.length ||
        filterState.ageGroups.some(
          (ageGroup) => manuscript.ageGroup.id === ageGroup.id
        )) &&
      (!filterState.minWordCount ||
        manuscript.wordCount >= filterState.minWordCount) &&
      (!filterState.maxWordCount ||
        manuscript.wordCount <= filterState.maxWordCount) &&
      (filterState.status.id === StatusFilter.all.id ||
        manuscript.status.id === filterState.status.id)
    )
  })

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

          <ManuscriptsList
            manuscripts={filteredManuscripts}
            showStatusFilter={true}
            setStatusForManuscript={handleSetStatusForManuscript}
          />
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
