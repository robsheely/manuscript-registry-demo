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
  Switch
} from '@mui/material'
import { useState } from 'react'
import { Author } from './Author.entity'
import { remult } from 'remult'
import { ErrorInfo } from 'remult'

const authorRepo = remult.repo(Author)

interface IProps {
  author: Author
  onClose: () => void
  onSaved: (author: Author) => void
}

export const AuthorEdit: React.FC<IProps> = ({ author, onSaved, onClose }) => {
  const [state, setState] = useState(author)

  const [errors, setErrors] = useState<ErrorInfo<Author>>()
  const handleClose = () => {
    onClose()
  }
  const handleSave = async () => {
    try {
      setErrors(undefined)
      let newAuthor = await authorRepo.save(state)
      onSaved(newAuthor)
      handleClose()
    } catch (err: any) {
      setErrors(err)
    }
  }

  return (
    <div>
      <Dialog open={Boolean(author)} onClose={handleClose}>
        <DialogTitle>{!author.id ? 'Create ' : 'Update '} Author</DialogTitle>
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
              </Stack>
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
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <FormControl
                    sx={{ flexGrow: 1 }}
                    error={Boolean(errors?.modelState?.published)}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.published}
                          onChange={(e) =>
                            setState({
                              ...state,
                              published: e.target.checked
                            })
                          }
                        />
                      }
                      label="I've been published before."
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
                      control={
                        <Switch
                          checked={state.agented}
                          onChange={(e) =>
                            setState({
                              ...state,
                              agented: e.target.checked
                            })
                          }
                        />
                      }
                      label="I've had an agent before."
                    />
                    <FormHelperText>
                      {errors?.modelState?.agented}
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </Stack>
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
              <TextField
                label="Bio"
                multiline
                error={Boolean(errors?.modelState?.bio)}
                helperText={errors?.modelState?.bio}
                fullWidth
                value={state.bio}
                onChange={(e) => setState({ ...state, bio: e.target.value })}
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
