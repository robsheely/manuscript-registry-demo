import React, { useEffect, useState } from 'react'
import { Manuscript } from './Manuscript.entity'
import { Author } from '../Authors/Author.entity'
import { Link } from 'react-router-dom'
import { getValueList, remult } from 'remult'
import { DataGrid, DataGridProps, GridColDef, GridRow } from '@mui/x-data-grid'
import { Status } from './Status'
import { IconButton, MenuItem, Select } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

const authorRepo = remult.repo(Author)

export const ManuscriptsList: React.FC<{
  manuscripts: Manuscript[]
  setStatusForManuscript: (manuscript: Manuscript, status: Status) => void
  showStatusFilter?: boolean
  setEditManuscript?: (manuscript: Manuscript) => void
}> = ({
  manuscripts,
  setStatusForManuscript,
  showStatusFilter,
  setEditManuscript
}) => {
  const [authors, setAuthors] = useState<Author[]>([])

  const statuses = getValueList(Status)

  useEffect(() => {
    ;(async () => {
      const authors = await authorRepo.find()
      setAuthors(authors)
    })()
  }, [])

  const filterColumns: GridColDef[] = [
    {
      field: 'status',
      headerName: 'STATUS',
      headerAlign: 'center',
      align: 'center',
      flex: 150,
      renderCell: (params) => {
        return (
          <Select
            size="small"
            autoWidth={true}
            label="Status"
            sx={{ width: '100%' }}
            value={params.value.id}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onChange={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const chosenStatus = getValueList(Status).find(
                (status) => status.id === e.target.value
              )
              setStatusForManuscript(params.row, chosenStatus!)
            }}
          >
            {statuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.caption}
              </MenuItem>
            ))}
          </Select>
        )
      }
    },
    {
      field: 'createdAt',
      headerName: 'ADDED',
      flex: 100,
      valueGetter: (_value, row) => {
        return new Date(row.createdAt).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    }
  ]

  const editColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'EDIT',
      headerAlign: 'center',
      align: 'center',
      flex: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setEditManuscript && setEditManuscript(params.row)
            }}
            style={{ marginLeft: '10px' }}
          >
            <EditIcon sx={{ color: '#1976d2' }} />
          </IconButton>
        )
      }
    }
  ]

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'TITLE', flex: 200 },
    ...(!setEditManuscript
      ? [{ field: 'author', headerName: 'AUTHOR', flex: 130 }]
      : []),
    {
      field: 'genre',
      headerName: 'GENRE',
      flex: 200,
      valueGetter: (_value, row) => row.genre.caption
    },
    {
      field: 'age',
      headerName: 'AGE',
      flex: 90,
      valueGetter: (_value, row) => row.ageGroup.caption
    },
    {
      field: 'wordCount',
      headerName: 'WORDS',
      flex: 100,
      valueGetter: (_value, row) => row.wordCount.toLocaleString('en-US')
    },
    ...(showStatusFilter ? filterColumns : []),
    ...(setEditManuscript ? editColumns : [])
  ]

  const rows = manuscripts.map((manuscript) => {
    const author = authors.find((a) => a.id === manuscript.authorId)
    return {
      ...manuscript,
      author: `${author?.firstName} ${author?.lastName}`
    }
  })

  const Row = ({ ...props }) => {
    return (
      <Link
        to={`/manuscripts/${props.row.id}`}
        style={{ color: 'black', textDecoration: 'none' }}
      >
        <GridRow {...props} />
      </Link>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          // @ts-ignore
          row: Row as DataGridProps['slots']['row'],
          footer: () => <div />
        }}
        paginationMode="server"
        initialState={{}}
      />
    </div>
  )
}
