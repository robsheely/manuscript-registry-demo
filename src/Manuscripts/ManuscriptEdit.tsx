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
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Manuscript } from './Manuscript.entity'
import { remult } from 'remult'
import { ErrorInfo, getValueList } from 'remult'

import { Genre } from '../Authors/Genre'
import { AgeGroup } from '../Authors/AgeGroup'
import NumberInput from '../utils/NumberInput'
import FileUpload from './FileUpload'
import { Status } from './Status'

const manuscriptRepo = remult.repo(Manuscript)

interface IProps {
  manuscript: Manuscript
  onClose: () => void
  onSaved: (manuscript: Manuscript) => void
}

export const ManuscriptEdit: React.FC<IProps> = ({
  manuscript,
  onSaved,
  onClose
}) => {
  const [errors, setErrors] = useState<ErrorInfo<Manuscript>>()
  const handleClose = () => {
    onClose()
  }
  const [state, setState] = useState(manuscript)

  useEffect(() => {
    const statuses = getValueList(Status)
    if (!state.status) {
      setState({ ...state, status: statuses[1] })
    }
  }, [manuscript])

  const handleSave = async () => {
    try {
      setErrors(undefined)
      let newManuscript = await manuscriptRepo.save(state)
      onSaved(newManuscript)
      handleClose()
    } catch (err: any) {
      console.log('ManuscriptEdit err:', err)
      setErrors(err)
    }
  }

  return (
    <div>
      <Dialog open={Boolean(manuscript)} onClose={handleClose}>
        <DialogTitle>
          {!manuscript.id ? 'Create ' : 'Update '} Manuscript
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }} noValidate autoComplete="off">
            <Stack spacing={2}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <TextField
                  label="Title"
                  error={Boolean(errors?.modelState?.title)}
                  helperText={errors?.modelState?.title}
                  value={state.title}
                  onChange={(e) =>
                    setState({ ...state, title: e.target.value })
                  }
                />
              </Stack>
              <Divider />
              <FormControl
                sx={{ flexGrow: 1 }}
                error={Boolean(errors?.modelState?.genre)}
              >
                <InputLabel id="genre-label">Genre</InputLabel>
                <Select
                  labelId="genre-label"
                  label="Genre"
                  value={state.genre?.id}
                  onChange={(e) =>
                    setState({
                      ...state,
                      genre: getValueList(Genre).find(
                        (item) => item.id === e.target.value
                      )!
                    })
                  }
                >
                  {getValueList(Genre).map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.caption}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors?.modelState?.genre}</FormHelperText>
              </FormControl>

              <FormControl
                sx={{ flexGrow: 1 }}
                error={Boolean(errors?.modelState?.ageGroup)}
              >
                <InputLabel id="ageGroup-label">Age Group</InputLabel>
                <Select
                  labelId="ageGroup-label"
                  label="Age Group"
                  value={state.ageGroup?.id}
                  onChange={(e) =>
                    setState({
                      ...state,
                      ageGroup: getValueList(AgeGroup).find(
                        (item) => item.id === e.target.value
                      )!
                    })
                  }
                >
                  {getValueList(AgeGroup).map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.caption}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors?.modelState?.ageGroup}</FormHelperText>
              </FormControl>
              <FormControl
                sx={{ flexGrow: 1 }}
                error={Boolean(errors?.modelState?.wordCount)}
              >
                <NumberInput
                  placeHolder="Word count"
                  labelId="wordCount-label"
                  value={state.wordCount}
                  onChange={(_e, value) =>
                    setState({ ...state, wordCount: value || 0 })
                  }
                />
                <FormHelperText>{errors?.modelState?.wordCount}</FormHelperText>
              </FormControl>

              <TextField
                label="Target audience"
                error={Boolean(errors?.modelState?.target)}
                helperText={errors?.modelState?.target}
                fullWidth
                value={state.target}
                onChange={(e) => setState({ ...state, target: e.target.value })}
              />
              <TextField
                label="Blurb"
                multiline
                error={Boolean(errors?.modelState?.blurb)}
                helperText={errors?.modelState?.blurb}
                fullWidth
                value={state.blurb}
                onChange={(e) => setState({ ...state, blurb: e.target.value })}
              />
              <TextField
                label="Pitch"
                multiline
                error={Boolean(errors?.modelState?.pitch)}
                helperText={errors?.modelState?.pitch}
                fullWidth
                value={state.pitch}
                onChange={(e) => setState({ ...state, pitch: e.target.value })}
              />
              <Divider />
              <TextField
                label="Synopsis"
                multiline
                error={Boolean(errors?.modelState?.synopsis)}
                helperText={errors?.modelState?.synopsis}
                fullWidth
                value={state.synopsis}
                onChange={(e) =>
                  setState({ ...state, synopsis: e.target.value })
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={state.published}
                    onChange={(e) =>
                      setState({ ...state, published: e.target.checked })
                    }
                  />
                }
                label="Has been published before."
              />
              <FileUpload
                onChange={(file: { name: string; image: string }) =>
                  setState({ ...state, script: file })
                }
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
