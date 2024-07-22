import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { getValueList } from 'remult'

import { Genre } from '../Authors/Genre'
import { AgeGroup } from '../Authors/AgeGroup'
import NumberInput from '../utils/NumberInput'

type Props = {
  state: ManuscriptFilterState
  onClose: () => void
  onSaved: (newState: ManuscriptFilterState) => void
}

export type ManuscriptFilterState = {
  title: string
  author: string
  genres: Genre[]
  ageGroups: AgeGroup[]
  minWordCount: number
  maxWordCount: number
}

export const ManuscriptFilterEdit: React.FC<Props> = ({
  state,
  onSaved,
  onClose
}) => {
  const [newState, setNewState] = useState(state)
  const handleClose = () => {
    onClose()
  }

  const handleSave = () => {
    onSaved(newState)
    handleClose()
  }

  const handleGenreChange = (genre: Genre, checked: boolean) => {
    const genres = [...newState.genres]
    const index = genres.indexOf(genre)
    if (!checked) {
      if (index > -1) {
        genres.splice(index, 1)
      }
    } else {
      if (index === -1) {
        genres.push(genre)
      }
    }
    setNewState({ ...newState, genres })
  }

  const handleAgeGroupChange = (ageGroup: AgeGroup, checked: boolean) => {
    const ageGroups = [...newState.ageGroups]
    const index = ageGroups.indexOf(ageGroup)
    if (!checked) {
      if (index > -1) {
        ageGroups.splice(index, 1)
      }
    } else {
      if (index === -1) {
        ageGroups.push(ageGroup)
      }
    }
    setNewState({ ...newState, ageGroups })
  }

  return (
    <Dialog open={Boolean(state)} onClose={handleClose}>
      <DialogTitle>Manuscript Filters</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 1 }} noValidate autoComplete="off">
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={0}
            >
              <TextField
                label="Title"
                value={newState.title}
                onChange={(e) =>
                  setNewState({ ...newState, title: e.target.value })
                }
              />
              <TextField
                label="Author"
                value={newState.author}
                onChange={(e) =>
                  setNewState({ ...newState, author: e.target.value })
                }
              />
            </Stack>
            <Divider />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={2}
            >
              <FormGroup sx={{ flexGrow: 1 }}>
                <InputLabel sx={{ marginBottom: 1 }} id="genre-label">
                  Genre
                </InputLabel>
                {getValueList(Genre).map((genre) => (
                  <FormControlLabel
                    control={<Checkbox sx={{ height: 13 }} />}
                    label={
                      <Typography sx={{ fontSize: 13 }}>
                        {genre.caption}
                      </Typography>
                    }
                    checked={newState.genres.includes(genre)}
                    onChange={(_event, checked) =>
                      handleGenreChange(genre, checked)
                    }
                  />
                ))}
              </FormGroup>
              <FormGroup sx={{ flexGrow: 1 }}>
                <InputLabel sx={{ marginBottom: 1 }} id="ageGroup-label">
                  Age Group
                </InputLabel>
                {getValueList(AgeGroup).map((ageGroup) => (
                  <FormControlLabel
                    control={<Checkbox sx={{ height: 13 }} />}
                    label={
                      <Typography sx={{ fontSize: 13, marginRight: 10 }}>
                        {ageGroup.caption}
                      </Typography>
                    }
                    checked={newState.ageGroups.includes(ageGroup)}
                    onChange={(_event, checked) =>
                      handleAgeGroupChange(ageGroup, checked)
                    }
                  />
                ))}
              </FormGroup>
            </Stack>
            <Divider />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={2}
            >
              <FormControl sx={{ flexGrow: 1 }}>
                <FormControlLabel
                  control={
                    <div
                      style={{ width: 100, marginLeft: 10, marginRight: 10 }}
                    >
                      <NumberInput
                        placeHolder="Min Word count"
                        labelId="wordCount-label"
                        value={newState.minWordCount}
                        onChange={(_e, value) =>
                          setNewState({
                            ...newState,
                            minWordCount: value ?? -1
                          })
                        }
                      />
                    </div>
                  }
                  label="Min Word count:"
                  labelPlacement="start"
                />
              </FormControl>
              <FormControl sx={{ flexGrow: 1 }}>
                <FormControlLabel
                  control={
                    <div
                      style={{ width: 100, marginLeft: 10, marginRight: 10 }}
                    >
                      <NumberInput
                        placeHolder="Max Word count"
                        labelId="wordCount-label"
                        value={newState.maxWordCount}
                        onChange={(_e, value) =>
                          setNewState({
                            ...newState,
                            maxWordCount: value ?? -1
                          })
                        }
                      />
                    </div>
                  }
                  label="Max Word count:"
                  labelPlacement="start"
                />
              </FormControl>
            </Stack>

            <FormControl sx={{ flexGrow: 1 }}></FormControl>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
