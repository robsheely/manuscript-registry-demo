import {
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  alpha
} from '@mui/material'
import React, { useState } from 'react'
import { Manuscript } from './Manuscript.entity'
import AddIcon from '@mui/icons-material/Add'
import { ManuscriptEdit } from './ManuscriptEdit'
import { Author } from '../Authors/Author.entity'
import { Link } from 'react-router-dom'
import { useIsDesktop } from '../utils/useIsDesktop'

export const ManuscriptsList: React.FC<{
  manuscripts: Manuscript[]
  setManuscripts: (manuscripts: Manuscript[]) => void
  defaultAuthor: Author
  loading: boolean
  itemsPerPage?: number
  addedManuscripts?: Manuscript[]
  setAddedManuscripts?: (manuscripts: Manuscript[]) => void
}> = ({
  manuscripts,
  setManuscripts,
  defaultAuthor,
  loading,
  children,
  itemsPerPage = 10,
  addedManuscripts = [] as Manuscript[],
  setAddedManuscripts = (c: Manuscript[]) => {}
}) => {
  const [editManuscript, setEditManuscript] = useState<Manuscript>()
  // const deleteManuscript = async (deletedManuscript: Manuscript) => {
  //     await amRepo.delete(deletedManuscript);
  //     setManuscripts(manuscripts.filter(contact => deletedManuscript.id !== contact.id));
  // }
  const editManuscriptSaved = (afterEditManuscript: Manuscript) => {
    if (!editManuscript?.id) {
      setManuscripts([afterEditManuscript, ...manuscripts])
      setAddedManuscripts([afterEditManuscript, ...addedManuscripts])
    } else
      setManuscripts(
        manuscripts.map((manuscript) =>
          manuscript.id === afterEditManuscript.id
            ? afterEditManuscript
            : manuscript
        )
      )
  }
  const create = () => {
    const newManuscript = new Manuscript()
    newManuscript.author = defaultAuthor
    setEditManuscript(newManuscript)
  }
  const isDesktop = useIsDesktop()

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        {children}
        <div>
          {isDesktop ? (
            <Button
              variant="contained"
              onClick={create}
              startIcon={<AddIcon />}
            >
              Add Manuscript
            </Button>
          ) : (
            <Button onClick={create} variant="contained">
              <AddIcon />
            </Button>
          )}
        </div>
      </Box>
      <List>
        {loading &&
          Array.from(Array(itemsPerPage).keys()).map((i) => (
            <ListItem disablePadding key={i}>
              <ListItemButton>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" />}
                  secondary={<Skeleton variant="text" />}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        {!loading &&
          manuscripts.map((manuscript) => (
            <ListItem
              disablePadding
              key={manuscript.id}
              sx={{
                backgroundColor: (theme) =>
                  addedManuscripts?.includes(manuscript)
                    ? alpha(theme.palette.secondary.light, 0.1)
                    : undefined
              }}
            >
              <ListItemButton
                component={Link}
                to={`/manuscripts/${manuscript.id}`}
              >
                <ListItemText
                  primary={manuscript.title}
                  secondary={
                    <>
                      {manuscript.title} at {manuscript.author?.firstName}{' '}
                      {manuscript.tags?.map((tag) => (
                        <span
                          key={tag.tag.id}
                          style={{
                            color: 'InfoText',
                            backgroundColor: tag.tag.color,
                            padding: 4,
                            paddingLeft: 8,
                            paddingRight: 8,
                            margin: 4,
                            borderRadius: 20
                          }}
                        >
                          {tag.tag.tag}
                        </span>
                      ))}
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      {editManuscript && (
        <ManuscriptEdit
          manuscript={editManuscript}
          onClose={() => setEditManuscript(undefined)}
          onSaved={(manuscript) => {
            editManuscriptSaved(manuscript)
          }}
        />
      )}
    </>
  )
}
