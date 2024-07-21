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

  const [authors, setAuthors] = useState<{
    authors: Author[]
    paginator?: Paginator<Author>
  }>({
    authors: []
  })

  console.log('authors:', authors)

  useEffect(() => {
    ;(async () => {
      const paginator = await amRepo
        .query({
          where: {
            lastName: { $contains: filter.search }
          },
          pageSize: 50
        })
        .paginator()
      setAuthors({ authors: paginator.items, paginator: paginator })
    })()
  }, [filter.search, filter.size, filter.sector])

  const itemCount = authors.paginator
    ? authors.paginator.hasNextPage
      ? authors.authors.length + 1
      : authors.authors.length
    : 0

  const loadMoreItems = async () => {
    if (authors.paginator) {
      const newPaginator = await authors.paginator.nextPage()
      setAuthors({
        authors: [...authors.authors, ...newPaginator.items],
        paginator: newPaginator
      })
    }
  }

  const isItemLoaded = (index: number) =>
    !!authors.paginator &&
    (!authors.paginator.hasNextPage || index < authors.authors.length)

  const [editAuthor, setEditAuthor] = useState<Author>()
  const deleteAuthor = async (deletedAuthor: Author) => {
    await amRepo.delete(deletedAuthor)
    setAuthors({
      authors: authors.authors.filter(
        (author) => deletedAuthor.id !== author.id
      ),
      paginator: authors.paginator
    })
  }
  const editAuthorSaved = (editAuthor: Author) =>
    setAuthors({
      authors: authors.authors.map((author) =>
        author.id === editAuthor.id ? editAuthor : author
      ),
      paginator: authors.paginator
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
                onClick={() => setEditAuthor(new Author())}
                startIcon={<AddIcon />}
              >
                Add Author
              </Button>
            ) : (
              <Button
                onClick={() => setEditAuthor(new Author())}
                variant="contained"
              >
                <AddIcon />
              </Button>
            )}
          </div>
        </Box>
        <List>
          {authors.paginator ? (
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
                      const author = authors.authors[index]
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
                                  onClick={() => deleteAuthor(author)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => setEditAuthor(author)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Stack>
                            }
                          >
                            <ListItemButton
                              component={Link}
                              to={`/authors/${author.id}`}
                            >
                              <ListItemText
                                primary={
                                  <div>
                                    {author.firstName +
                                      ' ' +
                                      author.lastName +
                                      ' ' +
                                      author.city +
                                      ', ' +
                                      author.stateAbbr +
                                      ' ' +
                                      (author.manuscripts?.length === undefined
                                        ? 0
                                        : author.manuscripts?.length) +
                                      ' manuscripts'}
                                  </div>
                                }
                              />
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
        {editAuthor && (
          <AuthorEdit
            author={editAuthor}
            onClose={() => setEditAuthor(undefined)}
            onSaved={(author) => {
              editAuthorSaved(author)
            }}
          />
        )}
      </Grid>
    </Grid>
  )
}
