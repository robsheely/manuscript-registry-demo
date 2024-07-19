import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField
} from '@mui/material'
import { useEffect, useState } from 'react'
import { remult } from 'remult'
import { Author } from './Author.entity'
import AddIcon from '@mui/icons-material/Add'
import { AuthorEdit } from './AuthorEdit'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSearchParams } from 'react-router-dom'
import { AuthorSize } from './AuthorSize'
import { Link } from 'react-router-dom'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { getValueList, Paginator } from 'remult'
import { useIsDesktop } from '../utils/useIsDesktop'

const amRepo = remult.repo(Author)

export const AuthorsList: React.FC<{}> = () => {
  let [searchParams, setSearchParams] = useSearchParams()
  const filter = {
    search: searchParams.get('search') || '',
    size: searchParams.get('size') || '',
    sector: searchParams.get('sector') || ''
  }
  const patchFilter = (f: Partial<typeof filter>) => {
    setSearchParams({ ...filter, ...f })
  }

  const [companies, setCompanies] = useState<{
    companies: Author[]
    paginator?: Paginator<Author>
  }>({
    companies: []
  })

  useEffect(() => {
    ;(async () => {
      const paginator = await amRepo
        .query({
          where: {
            name: { $contains: filter.search },
            size: filter.size
              ? getValueList(AuthorSize).find(
                  (item) => item.id === +filter.size
                )
              : undefined,
            sector: filter.sector ? filter.sector : undefined
          },
          pageSize: 50
        })
        .paginator()
      setCompanies({ companies: paginator.items, paginator: paginator })
    })()
  }, [filter.search, filter.size, filter.sector])

  const itemCount = companies.paginator
    ? companies.paginator.hasNextPage
      ? companies.companies.length + 1
      : companies.companies.length
    : 0

  const loadMoreItems = async () => {
    if (companies.paginator) {
      const newPaginator = await companies.paginator.nextPage()
      setCompanies({
        companies: [...companies.companies, ...newPaginator.items],
        paginator: newPaginator
      })
    }
  }

  const isItemLoaded = (index: number) =>
    !!companies.paginator &&
    (!companies.paginator.hasNextPage || index < companies.companies.length)

  const [editCompany, setEditCompany] = useState<Author>()
  const deleteCompany = async (deletedCompany: Author) => {
    await amRepo.delete(deletedCompany)
    setCompanies({
      companies: companies.companies.filter(
        (author) => deletedCompany.id !== author.id
      ),
      paginator: companies.paginator
    })
  }
  const editCompanySaved = (editCompany: Author) =>
    setCompanies({
      companies: companies.companies.map((author) =>
        author.id === editCompany.id ? editCompany : author
      ),
      paginator: companies.paginator
    })

  const isDesktop = useIsDesktop()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={10}>
        <Box display="flex" justifyContent="space-between">
          <TextField
            label="Search"
            variant="filled"
            value={filter.search}
            onChange={(e) => patchFilter({ search: e.target.value })}
          />
          <div>
            {isDesktop ? (
              <Button
                variant="contained"
                onClick={() => setEditCompany(new Author())}
                startIcon={<AddIcon />}
              >
                Add Author
              </Button>
            ) : (
              <Button
                onClick={() => setEditCompany(new Author())}
                variant="contained"
              >
                <AddIcon />
              </Button>
            )}
          </div>
        </Box>
        <List>
          {companies.paginator ? (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeList
                  className="List"
                  height={1000}
                  itemCount={itemCount}
                  itemSize={50}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                  width={'100%'}
                >
                  {({ index, style }) => {
                    if (!isItemLoaded(index)) {
                      return <div style={style}>Loading...</div>
                    } else {
                      const author = companies.companies[index]
                      return (
                        <div style={style}>
                          <ListItem
                            disablePadding
                            key={author.id}
                            secondaryAction={
                              <Stack direction="row" spacing={2}>
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => deleteCompany(author)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => setEditCompany(author)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Stack>
                            }
                          >
                            <ListItemButton
                              component={Link}
                              to={`/companies/${author.id}`}
                            >
                              <ListItemText primary={author.name} />
                            </ListItemButton>
                          </ListItem>
                        </div>
                      )
                    }
                  }}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          ) : null}
        </List>
        {editCompany && (
          <AuthorEdit
            author={editCompany}
            onClose={() => setEditCompany(undefined)}
            onSaved={(author) => {
              editCompanySaved(author)
            }}
          />
        )}
      </Grid>
    </Grid>
  )
}
