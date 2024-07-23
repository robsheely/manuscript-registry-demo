import { Box, Typography, Tab } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { repo } from 'remult'
import { Manuscript } from './Manuscript.entity'
import { Author } from '../Authors/Author.entity'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { ManuscriptDetails } from './ManuscriptDetails'
import { ManuscriptScript } from './ManuscriptScript'
import { ManuscriptNotes } from './ManuscriptNotes'

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

  if (loading) return <span>Loading</span>
  if (!manuscript) return <span>not found</span>

  return (
    <Box mt={2} display="flex">
      <Box flex="1">
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
                <Tab label="Notes" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <ManuscriptDetails manuscript={manuscript!} author={author} />
            </TabPanel>
            <TabPanel value="2">
              <ManuscriptScript manuscript={manuscript!} />
            </TabPanel>
            <TabPanel value="3">
              <ManuscriptNotes manuscript={manuscript!} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Box>
  )
}
