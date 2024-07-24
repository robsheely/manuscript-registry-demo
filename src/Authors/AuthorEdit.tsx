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
  FormHelperText,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Author } from './Author.entity'
import { remult } from 'remult'
import { ErrorInfo } from 'remult'
import { ManuscriptsList } from '../Manuscripts/ManuscriptsList'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { ManuscriptEdit } from '../Manuscripts/ManuscriptEdit'
import AddIcon from '@mui/icons-material/Add'
import TextEditor from '../utils/TextEditor'
import { Genre } from './Genre'
import { AgeGroup } from './AgeGroup'
import { Status } from '../Manuscripts/Status'

const authorRepo = remult.repo(Author)
const manuscriptsRepo = remult.repo(Manuscript)

interface IProps {
  author: Author
  onClose: () => void
  onSaved: (author: Author) => void
}

export const AuthorEdit: React.FC<IProps> = ({ author, onSaved, onClose }) => {
  const [state, setState] = useState(author)
  const [errors, setErrors] = useState<ErrorInfo<Author>>()
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])
  const [editManuscript, setEditManuscript] = useState<Manuscript | undefined>()

  useEffect(() => {
    if (author.firstName !== '') {
      authorRepo
        .relations(author)
        .manuscripts.find({
          include: {
            manuscript: true
          }
        })
        .then((authorManuscript) => {
          const manuscripts = authorManuscript
            .filter((authorManuscript) => authorManuscript.manuscript)
            .map((authorManuscript) => authorManuscript.manuscript)
          setManuscripts(manuscripts)
        })
    }
  }, [author])

  const handleClose = () => {
    onClose()
  }

  const handleSave = async () => {
    const ref = authorRepo.getEntityRef(author)
    try {
      setErrors(undefined)
      author = Object.assign(author, state)
      await author.saveWithManuscripts!(
        manuscripts.map((manuscript) => manuscript.id!)
      )
      onSaved(author)
      handleClose()
    } catch (err: any) {
      setErrors(err)
      ref.undoChanges()
    }
  }

  const updateTextState = (field: string, value: string) => {
    setState((state1) => {
      console.log('updateTextState:', state1, field, value)
      return { ...state1, [field]: value }
    })
  }

  // const deleteManuscript = async (deletedManuscript: Manuscript) => {
  //     await manuscriptsRepo.delete(deletedManuscript);
  //     setManuscripts(manuscripts.filter(contact => deletedManuscript.id !== contact.id));
  // }

  const editManuscriptSaved = async (afterEditManuscript: Manuscript) => {
    const newManuscripts =
      editManuscript?.title === ''
        ? [afterEditManuscript, ...manuscripts]
        : [...manuscripts]
    setManuscripts(newManuscripts)
    await manuscriptsRepo.save(afterEditManuscript)
  }

  const createManuscript = () => {
    const newManuscript = new Manuscript()
    newManuscript.title = ''
    newManuscript.genre = Genre.F1
    newManuscript.ageGroup = AgeGroup.adult
    newManuscript.status = Status.unread
    newManuscript.blurb = ''
    newManuscript.pitch = ''
    newManuscript.wordCount = 0
    newManuscript.synopsis
    newManuscript.published = false
    newManuscript.author = author
    setEditManuscript(newManuscript)
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={Boolean(author)}
        onClose={handleClose}
      >
        <DialogTitle align="center">
          {!author.id ? 'Create ' : 'Update '} Author
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
                  autoFocus
                  label="First name"
                  error={Boolean(errors?.modelState?.firstName)}
                  helperText={errors?.modelState?.firstName}
                  fullWidth
                  value={state.firstName}
                  onChange={(e) =>
                    setState({ ...state, firstName: e.target.value })
                  }
                />
                <TextField
                  label="Last name"
                  error={Boolean(errors?.modelState?.lastName)}
                  helperText={errors?.modelState?.lastName}
                  fullWidth
                  value={state.lastName}
                  onChange={(e) =>
                    setState({ ...state, lastName: e.target.value })
                  }
                />
              </Stack>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.email)}
                >
                  <TextField
                    label="Email"
                    error={Boolean(errors?.modelState?.email)}
                    helperText={errors?.modelState?.email}
                    fullWidth
                    value={state.email}
                    onChange={(e) =>
                      setState({ ...state, email: e.target.value })
                    }
                  />
                  <FormHelperText>{errors?.modelState?.email}</FormHelperText>
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.phoneNumber)}
                >
                  <TextField
                    sx={{ flexGrow: 1 }}
                    label="Phone number"
                    error={Boolean(errors?.modelState?.phoneNumber)}
                    helperText={errors?.modelState?.phoneNumber}
                    value={state.phoneNumber}
                    onChange={(e) =>
                      setState({ ...state, phoneNumber: e.target.value })
                    }
                  />
                  <FormHelperText>
                    {errors?.modelState?.phoneNumber}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.pronouns)}
                >
                  <TextField
                    label="Pronouns"
                    error={Boolean(errors?.modelState?.pronouns)}
                    helperText={errors?.modelState?.pronouns}
                    fullWidth
                    value={state.pronouns}
                    onChange={(e) =>
                      setState({ ...state, pronouns: e.target.value })
                    }
                  />
                </FormControl>
              </Stack>
              <Divider />
              <TextField
                label="Address"
                error={Boolean(errors?.modelState?.address)}
                helperText={errors?.modelState?.address}
                fullWidth
                value={state.address}
                onChange={(e) =>
                  setState({ ...state, address: e.target.value })
                }
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="City"
                  error={Boolean(errors?.modelState?.city)}
                  helperText={errors?.modelState?.city}
                  fullWidth
                  value={state.city}
                  onChange={(e) => setState({ ...state, city: e.target.value })}
                />
                <TextField
                  label="State abbr"
                  error={Boolean(errors?.modelState?.stateAbbr)}
                  helperText={errors?.modelState?.stateAbbr}
                  fullWidth
                  value={state.stateAbbr}
                  onChange={(e) =>
                    setState({ ...state, stateAbbr: e.target.value })
                  }
                />
                <TextField
                  label="Zip code"
                  error={Boolean(errors?.modelState?.zipcode)}
                  helperText={errors?.modelState?.zipcode}
                  fullWidth
                  value={state.zipcode}
                  onChange={(e) =>
                    setState({ ...state, zipcode: e.target.value })
                  }
                />
              </Stack>
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Website"
                  error={Boolean(errors?.modelState?.website)}
                  helperText={errors?.modelState?.website}
                  fullWidth
                  value={state.website}
                  onChange={(e) =>
                    setState({ ...state, website: e.target.value })
                  }
                />
                <TextField
                  label="Blog"
                  error={Boolean(errors?.modelState?.blog)}
                  helperText={errors?.modelState?.blog}
                  fullWidth
                  value={state.blog}
                  onChange={(e) => setState({ ...state, blog: e.target.value })}
                />
                <TextField
                  label="Twitter"
                  error={Boolean(errors?.modelState?.twitter)}
                  helperText={errors?.modelState?.twitter}
                  fullWidth
                  value={state.twitter}
                  onChange={(e) =>
                    setState({ ...state, twitter: e.target.value })
                  }
                />
              </Stack>
              <Divider />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                spacing={0}
              >
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.published)}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={state.published}
                        onChange={(e) =>
                          setState({
                            ...state,
                            published: e.target.checked
                          })
                        }
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13 }}>
                        I've been published before.
                      </Typography>
                    }
                  />
                  <FormHelperText>
                    {errors?.modelState?.published}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.agented)}
                >
                  <FormControlLabel
                    sx={{ flexGrow: 1 }}
                    control={
                      <Switch
                        size="small"
                        checked={state.agented}
                        onChange={(e) =>
                          setState({
                            ...state,
                            agented: e.target.checked
                          })
                        }
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13 }}>
                        I've had an agent before.
                      </Typography>
                    }
                  />
                  <FormHelperText>{errors?.modelState?.agented}</FormHelperText>
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 2 }}
                  error={Boolean(errors?.modelState?.agented)}
                >
                  <TextField
                    label="Name of former agent (if applicable)"
                    error={Boolean(errors?.modelState?.formerAgent)}
                    helperText={errors?.modelState?.formerAgent}
                    fullWidth
                    value={state.formerAgent}
                    onChange={(e) =>
                      setState({ ...state, formerAgent: e.target.value })
                    }
                  />
                </FormControl>
              </Stack>
              <Typography variant="h6">Bio:</Typography>
              <TextEditor
                placeHolder="Bio"
                html={state.bio}
                setHtml={(bio) => {
                  updateTextState('bio', bio)
                }}
              />
            </Stack>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography>Manuscripts:</Typography>
            <ManuscriptsList
              manuscripts={manuscripts}
              setEditManuscript={setEditManuscript}
              setStatusForManuscript={() => {}}
            />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="flex-end"
              spacing={2}
              sx={{ marginTop: 1 }}
            >
              <Button
                variant="contained"
                onClick={createManuscript}
                startIcon={<AddIcon />}
              >
                Add Manuscript
              </Button>
            </Stack>

            {editManuscript && (
              <ManuscriptEdit
                manuscript={editManuscript}
                onClose={() => setEditManuscript(undefined)}
                onSaved={(manuscript: Manuscript) => {
                  editManuscriptSaved(manuscript)
                }}
              />
            )}
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
