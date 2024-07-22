import React, { useEffect, useState } from 'react'
import { Manuscript } from './Manuscript.entity'
import { Author } from '../Authors/Author.entity'
import { Link } from 'react-router-dom'
import { remult } from 'remult'
import { DataGrid, DataGridProps, GridColDef, GridRow } from '@mui/x-data-grid'

const authorRepo = remult.repo(Author)

export const ManuscriptsList: React.FC<{
  manuscripts: Manuscript[]
}> = ({ manuscripts }) => {
  const [authors, setAuthors] = useState<Author[]>([])

  useEffect(() => {
    ;(async () => {
      const authors = await authorRepo.find()
      setAuthors(authors)
    })()
  }, [])

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'TITLE', flex: 200 },
    { field: 'author', headerName: 'AUTHOR', flex: 130 },
    {
      field: 'genre',
      headerName: 'GENRE',
      flex: 130,
      valueGetter: (_value, row) => row.genre.caption
    },
    {
      field: 'age',
      headerName: 'AGE',
      flex: 90,
      valueGetter: (_value, row) => row.ageGroup.caption
    },
    { field: 'wordCount', headerName: 'WORDS', flex: 100 },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 90,
      valueGetter: (_value, row) => row.status?.caption
    }
  ]

  const rows = manuscripts.map((manuscript) => {
    const author = authors.find((a) => a.id === manuscript.authorId)
    return {
      ...manuscript,
      author: `${author?.firstName} ${author?.lastName}`,
      wordCount: manuscript?.wordCount?.toLocaleString('en-US')
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
          row: Row as DataGridProps['slots']['row'],
          footer: () => <div />
        }}
        paginationMode="server"
        initialState={{}}
      />
    </div>
  )
}
