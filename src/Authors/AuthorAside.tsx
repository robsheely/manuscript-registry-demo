import { Box, Typography, Divider, Link, Button } from '@mui/material'
import { Author } from './Author.entity'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { AuthorEdit } from './AuthorEdit'

export const AuthorAside = ({
  author,
  setCompany,
  link = 'edit'
}: {
  author: Author
  setCompany: (author: Author) => void
  link?: string
}) => {
  const [editCompany, setEditCompany] = useState<Author>()

  return author ? (
    <>
      <Box ml={4} width={250} minWidth={250}>
        <Box textAlign="center" mb={2}>
          {link === 'edit' ? (
            <Button
              startIcon={<EditIcon />}
              onClick={() => setEditCompany(author)}
            >
              Edit Author
            </Button>
          ) : (
            <Button>Show Author</Button>
          )}
        </Box>

        <Typography variant="subtitle2">Author info</Typography>
        <Divider />

        <Box mt={2}>
          Website: <Link href={author.website}>{author.website}</Link>
          <br />
          LinkedIn: <Link href={author.linkedIn}>LinkedIn</Link>
        </Box>

        <Box mt={1}>
          {author.phoneNumber}{' '}
          <Typography variant="body1" color="textSecondary" component="span">
            Main
          </Typography>
        </Box>

        <Box mt={1} mb={3}>
          {author.address}
          <br />
          {author.city} {author.zipcode} {author.stateAbbr}
        </Box>

        <Typography variant="subtitle2">Background</Typography>
        <Divider />

        <Box mt={1}>
          <Typography variant="body1" color="textSecondary" component="span">
            Added on{' '}
            {author.createdAt.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
          <br />
          <Typography component="span" variant="body1" color="textSecondary">
            Followed by
          </Typography>{' '}
          <Link href="#">
            {author.accountManager
              ? `${author.accountManager.firstName} ${author.accountManager.lastName}`
              : ''}
          </Link>
        </Box>
      </Box>
      {editCompany && (
        <AuthorEdit
          author={editCompany}
          onClose={() => setEditCompany(undefined)}
          onSaved={(author) => {
            setCompany(author)
          }}
        />
      )}
    </>
  ) : null
}
