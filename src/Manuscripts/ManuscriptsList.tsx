import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton
} from '@mui/material'
import React from 'react'
import { Manuscript } from './Manuscript.entity'
import { Author } from '../Authors/Author.entity'
import { Link } from 'react-router-dom'

export const ManuscriptsList: React.FC<{
  manuscripts: Manuscript[]
  defaultAuthor?: Author
  loading: boolean
  itemsPerPage?: number
}> = ({ manuscripts, loading, itemsPerPage = 10 }) => {
  return (
    <>
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
            <ListItem disablePadding key={manuscript.id}>
              <ListItemButton
                component={Link}
                to={`/manuscripts/${manuscript.id}`}
              >
                <ListItemText
                  primary={manuscript.title}
                  secondary={
                    <>
                      {manuscript.title} at {manuscript.author?.firstName}{' '}
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </>
  )
}
