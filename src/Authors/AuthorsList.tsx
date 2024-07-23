import { Box, Button, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { remult } from 'remult'
import { Author } from './Author.entity'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { AuthorEdit } from './AuthorEdit'
import { Link } from 'react-router-dom'
import { Paginator } from 'remult'
import { DataGrid, GridColDef, GridRow } from '@mui/x-data-grid'
import { AuthorFilterEdit, AuthorFilterState } from './AuthorFilterEdit'

const authorRepo = remult.repo(Author)

const initialFilterState = {
  name: '',
  published: false,
  agented: false
}

export const AuthorsList: React.FC<{}> = () => {
  const [authors, setAuthors] = useState<{
    authors: Author[]
    paginator?: Paginator<Author>
  }>({
    authors: []
  })
  const [filterState, setFilterState] =
    useState<AuthorFilterState>(initialFilterState)
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [editAuthor, setEditAuthor] = useState<Author>()

  useEffect(() => {
    ;(async () => {
      const paginator = await authorRepo
        .query({
          pageSize: 50,
          include: {
            manuscripts: true
          }
        })
        .paginator()
      setAuthors({ authors: paginator.items, paginator: paginator })
    })()
  }, [])

  const handleFiltersSaved = (filters: AuthorFilterState) => {
    setFilterState(filters)
    setShowFilterDialog(false)
  }

  const editAuthorSaved = (editAuthor: Author) => {
    const isExisting = authors.authors.find((a) => a.id === editAuthor.id)

    const newAuthors = isExisting
      ? authors.authors.map((author) =>
          author.id === editAuthor.id ? editAuthor : author
        )
      : [...authors.authors, editAuthor]

    setAuthors({
      authors: newAuthors,
      paginator: authors.paginator
    })
    setEditAuthor(undefined)
  }

  const filteredAuthors = authors.authors.filter((author) => {
    return (
      (!filterState.name ||
        author.firstName
          .toLowerCase()
          .includes(filterState.name.toLowerCase()) ||
        author.lastName
          .toLowerCase()
          .includes(filterState.name.toLowerCase())) &&
      (!filterState.published || author.published) &&
      (!filterState.agented || author.agented)
    )
  })

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'FIRST NAME', flex: 100 },
    { field: 'lastName', headerName: 'LAST NAME', flex: 100 },
    {
      field: 'city',
      headerName: 'CITY',
      flex: 130
    },
    {
      field: 'stateAbbr',
      headerName: 'STATE',
      flex: 40
    },
    {
      field: 'manuscripts',
      headerName: '# MS',
      flex: 40,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_value, row) => {
        return row.manuscripts?.length === undefined
          ? 0
          : row.manuscripts?.length
      }
    },
    {
      field: 'createdAt',
      headerName: 'ADDED',
      flex: 60,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_value, row) => {
        return new Date(row.createdAt).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    },
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
              setEditAuthor(params.row)
            }}
            style={{ marginLeft: '10px' }}
          >
            <EditIcon sx={{ color: '#1976d2' }} />
          </IconButton>
        )
      }
    }
  ]

  const Row = ({ ...props }) => {
    return (
      <Link
        to={!editAuthor ? `/authors/${props.row.id}` : '#'}
        style={{ color: 'black', textDecoration: 'none' }}
      >
        <GridRow {...props} />
      </Link>
    )
  }

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
        AUTHORS
      </Typography>
      <div style={{ padding: '20px' }}>
        <Box
          display="flex"
          justifyContent="flex-end"
          style={{ marginBottom: '20px' }}
        >
          <Button variant="contained" onClick={() => setShowFilterDialog(true)}>
            Filter Authors
          </Button>
        </Box>
        <DataGrid
          rows={filteredAuthors}
          columns={columns}
          slots={{
            // @ts-ignore
            row: Row as DataGridProps['slots']['row'],
            footer: () => <div />
          }}
          paginationMode="server"
          initialState={{}}
        />
        <Box display="flex" justifyContent="space-between">
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 20
            }}
          >
            <Button
              variant="contained"
              onClick={() => setEditAuthor(new Author())}
              startIcon={<AddIcon />}
            >
              Add Author
            </Button>
          </div>
        </Box>
        {editAuthor && (
          <AuthorEdit
            author={editAuthor}
            onClose={() => setEditAuthor(undefined)}
            onSaved={(author) => {
              editAuthorSaved(author)
            }}
          />
        )}
        {showFilterDialog && (
          <AuthorFilterEdit
            state={filterState}
            onClose={() => setShowFilterDialog(false)}
            onSaved={handleFiltersSaved}
          />
        )}
      </div>
    </div>
  )
}
