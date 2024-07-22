import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { remult } from 'remult'
import { Author } from './Author.entity'
import AddIcon from '@mui/icons-material/Add'
import { AuthorEdit } from './AuthorEdit'
import { Link } from 'react-router-dom'
import { Paginator } from 'remult'
import { DataGrid, GridColDef, GridRow } from '@mui/x-data-grid'

const authorRepo = remult.repo(Author)

export const AuthorsList: React.FC<{}> = () => {
  const [authors, setAuthors] = useState<{
    authors: Author[]
    paginator?: Paginator<Author>
  }>({
    authors: []
  })

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

  const [editAuthor, setEditAuthor] = useState<Author>()

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
  }

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
      flex: 50
    },
    {
      field: 'manuscripts',
      headerName: 'MANUSCRIPTS',
      flex: 60,
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
      valueGetter: (_value, row) => {
        return new Date(row.createdAt).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    }
  ]

  const Row = ({ ...props }) => {
    return (
      <Link
        to={`/authors/${props.row.id}`}
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
        sx={{
          color: 'rgb(25, 118, 210)',
          filter: 'drop-shadow(3px 3px 4px #AAAAAA)',
          fontWeight: 'bold'
        }}
      >
        AUTHORS
      </Typography>
      <div style={{ padding: '20px' }}>
        <DataGrid
          rows={authors.authors}
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
      </div>
    </div>
  )
}
