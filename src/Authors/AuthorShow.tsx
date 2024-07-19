import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Tab,
  Typography
} from '@mui/material'
import { formatDistance } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { remult } from 'remult'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { ManuscriptsList } from '../Manuscripts/ManuscriptsList'
import { Deal } from '../Deals/Deal.entity'
import { useIsDesktop } from '../utils/useIsDesktop'
import { Author } from './Author.entity'
import { AuthorAside } from './AuthorAside'
import { Logo } from './Logo'

export const AuthorShow: React.FC<{}> = () => {
  let params = useParams()
  const [author, setAuthor] = useState<Author>()
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])
  const [deals, setDeals] = useState<Deal[]>([])

  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = React.useState('1')

  const isDesktop = useIsDesktop()

  useEffect(() => {
    ;(async () => {
      const author = await remult.repo(Author).findId(params.id!, {
        include: {
          accountManager: true,
          manuscripts: {
            include: {
              tags: true
            }
          },
          deals: true
        }
      })
      setAuthor(author)
      setLoading(false)
      if (author) {
        setManuscripts(author.manuscripts!)
        setDeals(author.deals!)
      }
    })()
  }, [params.id])
  if (loading) return <span>Loading</span>
  if (!author) return <span>not found</span>
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }}>
      <Box flex="1">
        <Card>
          <CardContent>
            <Stack>
              <Stack direction="row">
                <Logo url={author.logo} title={author.name} sizeInPixels={42} />
                <Stack sx={{ ml: 1 }} alignItems="flex-start">
                  <Typography variant="h5">{author.name}</Typography>
                  <Typography variant="body1">
                    {author.sector}, {author.size?.caption}
                  </Typography>
                </Stack>
              </Stack>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={currentTab}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      onChange={(_, v) => setCurrentTab(v)}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Manuscripts" value="1" />
                      <Tab label="Deals" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <ManuscriptsList
                      manuscripts={manuscripts}
                      setManuscripts={setManuscripts}
                      defaultAuthor={author}
                      loading={false}
                    />
                  </TabPanel>
                  <TabPanel value="2">
                    <List>
                      {deals.map((deal, index) => (
                        <ListItem disablePadding key={deal.id}>
                          <ListItemButton>
                            <ListItemText
                              primary={`${deal.name}`}
                              secondary={
                                <>
                                  {deal.stage} {deal.amount / 1000}
                                  {'K, '}
                                  {deal.type}
                                </>
                              }
                            />
                            {isDesktop && (
                              <ListItemSecondaryAction>
                                <Typography
                                  variant="body1"
                                  color="textSecondary"
                                >
                                  last activity{' '}
                                  {deal.updatedAt
                                    ? formatDistance(deal.updatedAt, new Date())
                                    : ''}{' '}
                                  ago
                                </Typography>
                              </ListItemSecondaryAction>
                            )}
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </TabPanel>
                </TabContext>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <AuthorAside author={author} setAuthor={setAuthor}></AuthorAside>
    </Stack>
  )
}
