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
  Switch,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Manuscript } from './Manuscript.entity'
import { remult } from 'remult'
import { ErrorInfo, getValueList } from 'remult'

import { Genre } from '../Authors/Genre'
import { AgeGroup } from '../Authors/AgeGroup'
import FileUpload from './FileUpload'
import { Status } from './Status'
import TextEditor from '../utils/TextEditor'

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
  const [state, setState] = useState(manuscript)

  const handleClose = () => {
    onClose()
  }

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
  const updateTextState = (field: string, value: string) => {
    setState((state1) => {
      console.log('updateTextState:', state1, field, value)
      return { ...state1, [field]: value }
    })
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={Boolean(manuscript)}
        onClose={handleClose}
      >
        <DialogTitle align="center">
          {!manuscript.id ? 'Create ' : 'Update '} Manuscript
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }} noValidate autoComplete="off">
            <Stack spacing={2}>
              <TextField
                label="Title"
                error={Boolean(errors?.modelState?.title)}
                helperText={errors?.modelState?.title}
                value={state.title}
                onChange={(e) => setState({ ...state, title: e.target.value })}
              />
              <Divider />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <FormControl
                  sx={{ flexGrow: 4 }}
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
                  sx={{ flexGrow: 2 }}
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
                  <FormHelperText>
                    {errors?.modelState?.ageGroup}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.wordCount)}
                >
                  <TextField
                    label="Word count"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                        {
                          display: 'none'
                        },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      }
                    }}
                    type="number"
                    error={Boolean(errors?.modelState?.wordCount)}
                    helperText={errors?.modelState?.wordCount}
                    value={state.wordCount}
                    onChange={(e) =>
                      setState({
                        ...state,
                        wordCount: parseInt(e.target.value)
                      })
                    }
                  />
                  <FormHelperText>
                    {errors?.modelState?.wordCount}
                  </FormHelperText>
                </FormControl>
              </Stack>
              <TextField
                label="Target audience"
                error={Boolean(errors?.modelState?.target)}
                helperText={errors?.modelState?.target}
                fullWidth
                value={state.target}
                onChange={(e) => setState({ ...state, target: e.target.value })}
              />
              <Divider />
              <Typography variant="h6">Blurb:</Typography>
              <TextEditor
                placeHolder="Blurb"
                html={state.blurb}
                setHtml={(blurb) => {
                  updateTextState('blurb', blurb)
                }}
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
              <Typography variant="h6">Comparable titles:</Typography>
              <TextEditor
                placeHolder="Comparable titles"
                html={state.comps}
                setHtml={(comps) => {
                  updateTextState('comps', comps)
                }}
              />
              <Divider />
              <Typography variant="h6">Synopsis:</Typography>
              <TextEditor
                placeHolder="Synopsis"
                html={state.synopsis}
                setHtml={(synopsis) => {
                  updateTextState('synopsis', synopsis)
                }}
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
              <Divider />
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
