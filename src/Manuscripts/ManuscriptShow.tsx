import { Box, Typography, Tab, Button, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { repo } from 'remult'
import { Manuscript } from './Manuscript.entity'
import { Author } from '../Authors/Author.entity'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { ManuscriptDetails } from './ManuscriptDetails'
import { ManuscriptScript } from './ManuscriptScript'
import { ManuscriptNotes } from './ManuscriptNotes'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ManuscriptFeedbackList } from './ManuscriptFeedbackList'
import { CollaborationsPage } from './CollaborationsPage'

export const ManuscriptShow: React.FC<{}> = () => {
  let params = useParams()
  const [manuscript, setManuscript] = useState<Manuscript>()
  const [author, setAuthor] = useState<Author>()

  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = React.useState('1')

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }

  useEffect(() => {
    ;(async () => {
      const manuscript = await repo(Manuscript).findId(params.id!, {
        include: {
          notes: true
        }
      })
      setManuscript(manuscript)
      const author = await repo(Author).findId(manuscript.authorId)
      setAuthor(author)
      setLoading(false)
    })()
  }, [params.id])

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: 30
        }}
      >
        <CircularProgress />
      </Box>
    )

  if (!manuscript) return <span>not found</span>

  return (
    <Box display="flex">
      <Box flex="1">
        <Button
          color="primary"
          component={Link}
          to={'/'}
          sx={{ marginBottom: 1 }}
          startIcon={<ArrowBackIcon />}
        >
          Manuscripts
        </Button>
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h4">{manuscript.title}</Typography>
        </div>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={currentTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Details" value="1" />
                <Tab label="Manuscript" value="2" />
                <Tab label="Feedback" value="3" />
                <Tab label="Notes" value="4" />
                <Tab label="Collaborations" value="5" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <ManuscriptDetails manuscript={manuscript!} author={author} />
            </TabPanel>
            <TabPanel value="2">
              <ManuscriptScript manuscript={manuscript!} />
            </TabPanel>
            <TabPanel value="3">
              <ManuscriptFeedbackList manuscript={manuscript!} />
            </TabPanel>
            <TabPanel value="4">
              <ManuscriptNotes manuscript={manuscript!} />
            </TabPanel>
            <TabPanel value="5">
              <CollaborationsPage />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Box>
  )
}
