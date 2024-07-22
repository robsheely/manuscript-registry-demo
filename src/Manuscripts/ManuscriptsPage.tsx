import {
  TextField,
  TablePagination,
  Stack,
  Divider,
  Box,
  CircularProgress
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { remult } from 'remult'
import { Manuscript } from './Manuscript.entity'

import { useSearchParams } from 'react-router-dom'
import { ManuscriptsList } from './ManuscriptsList'

const amRepo = remult.repo(Manuscript)

export const ManuscriptsPage: React.FC<{}> = () => {
  let [searchParams, setSearchParams] = useSearchParams()
  const filter = {
    search: searchParams.get('search') || ''
  }
  const patchFilter = (f: Partial<typeof filter>) => {
    setSearchParams({ ...filter, ...f })
  }
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [manuscriptsCount, setManuscriptsCount] = useState(0)

  const manuscriptsQuery = useMemo(() => {
    const query = amRepo.query({
      where: { title: { $contains: filter.search } },

      pageSize: rowsPerPage
    })
    query.count().then((count) => setManuscriptsCount(count))
    return query
  }, [filter.search, rowsPerPage])

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

  return (
    <div style={{ padding: '20px' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        style={{ marginBottom: 10 }}
        justifyContent="space-between"
        spacing={2}
      >
        <TextField
          label="Search"
          value={filter.search}
          onChange={(e) => patchFilter({ search: e.target.value })}
        />
        <TablePagination
          component="div"
          count={manuscriptsCount}
          page={page}
          onPageChange={(_, newPage) => {
            setPage(newPage)
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </Stack>
      <Divider />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ManuscriptsList manuscripts={manuscripts} />
      )}
    </div>
  )
}
