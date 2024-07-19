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
  Autocomplete
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Manuscript } from './Manuscript.entity'
import { remult } from 'remult'
import { ErrorInfo, getValueList } from 'remult'

import { AccountManager } from '../AccountManagers/AccountManager.entity'
import { Author } from '../Authors/Author.entity'
import { Gender } from './Gender'
import { Acquisition } from './Acquisition'
import { Status } from './Status'

const contactRepo = remult.repo(Manuscript)

interface IProps {
  contact: Manuscript
  onClose: () => void
  onSaved: (contact: Manuscript) => void
}

export const ManuscriptEdit: React.FC<IProps> = ({
  contact,
  onSaved,
  onClose
}) => {
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  useEffect(() => {
    remult.repo(AccountManager).find().then(setAccountManagers)
  }, [])
  const [authorSearch, setAuthorSearch] = useState('')
  useEffect(() => {
    remult
      .repo(Author)
      .find({ where: { name: { $contains: authorSearch } }, limit: 20 })
      .then((x) => setAuthors(x))
  }, [authorSearch])

  const [state, setState] = useState(contact)

  const [errors, setErrors] = useState<ErrorInfo<Manuscript>>()
  const handleClose = () => {
    onClose()
  }
  const handleSave = async () => {
    try {
      setErrors(undefined)
      let newManuscript = await contactRepo.save(state)
      onSaved(newManuscript)
      handleClose()
    } catch (err: any) {
      setErrors(err)
    }
  }

  return (
    <div>
      <Dialog open={Boolean(contact)} onClose={handleClose}>
        <DialogTitle>
          {!contact.id ? 'Create ' : 'Update '} Manuscript
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
                <TextField
                  label="Title"
                  error={Boolean(errors?.modelState?.title)}
                  helperText={errors?.modelState?.title}
                  value={state.title}
                  onChange={(e) =>
                    setState({ ...state, title: e.target.value })
                  }
                />
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.gender)}
                >
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    label="Gender"
                    value={state.gender?.id}
                    onChange={(e) =>
                      setState({
                        ...state,
                        gender: getValueList(Gender).find(
                          (item) => item.id === e.target.value
                        )!
                      })
                    }
                  >
                    {getValueList(Gender).map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.caption}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.modelState?.gender}</FormHelperText>
                </FormControl>
              </Stack>
              <FormControl
                sx={{ flexGrow: 1 }}
                error={Boolean(errors?.modelState?.accountManager)}
              >
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={authors}
                  value={state.author ? state.author : null}
                  getOptionLabel={(c) => c.name}
                  inputValue={authorSearch}
                  onChange={(e, newValue: Author | null) =>
                    setState({ ...state, author: newValue ? newValue : null! })
                  }
                  onInputChange={(e, newInput) => setAuthorSearch(newInput)}
                  renderInput={(params) => (
                    <TextField {...params} label="Author" />
                  )}
                />
                <FormHelperText>{errors?.modelState?.author}</FormHelperText>
              </FormControl>
              <Divider />

              <TextField
                label="Email"
                error={Boolean(errors?.modelState?.email)}
                helperText={errors?.modelState?.email}
                fullWidth
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
              />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <TextField
                  label="Phone number 1"
                  error={Boolean(errors?.modelState?.phoneNumber1)}
                  helperText={errors?.modelState?.phoneNumber1}
                  fullWidth
                  value={state.phoneNumber1}
                  onChange={(e) =>
                    setState({ ...state, phoneNumber1: e.target.value })
                  }
                />
                <TextField
                  label="Phone number 2"
                  error={Boolean(errors?.modelState?.phoneNumber2)}
                  helperText={errors?.modelState?.phoneNumber2}
                  fullWidth
                  value={state.phoneNumber2}
                  onChange={(e) =>
                    setState({ ...state, phoneNumber2: e.target.value })
                  }
                />
              </Stack>
              <Divider />
              <TextField
                label="Background"
                multiline
                error={Boolean(errors?.modelState?.background)}
                helperText={errors?.modelState?.background}
                fullWidth
                value={state.background}
                onChange={(e) =>
                  setState({ ...state, background: e.target.value })
                }
              />
              <TextField
                label="Avatar"
                error={Boolean(errors?.modelState?.avatar)}
                helperText={errors?.modelState?.avatar}
                fullWidth
                value={state.avatar}
                onChange={(e) => setState({ ...state, avatar: e.target.value })}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={state.hasNewsletter}
                    onChange={(e) =>
                      setState({ ...state, hasNewsletter: e.target.checked })
                    }
                  />
                }
                label="Has newsletter"
              />

              <Divider />
              <FormControl
                sx={{ flexGrow: 1 }}
                error={Boolean(errors?.modelState?.accountManager)}
              >
                <InputLabel id="accountManager-label">
                  Account Manager
                </InputLabel>
                <Select
                  labelId="accountManager-label"
                  label="Account Manager"
                  value={state.accountManagerId}
                  onChange={(e) =>
                    setState({
                      ...state,
                      accountManagerId: e.target.value
                    })
                  }
                >
                  <MenuItem value={''}></MenuItem>
                  {accountManagers?.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.lastName + ' ' + s.firstName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors?.modelState?.accountManager}
                </FormHelperText>
              </FormControl>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.status)}
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    label="Status"
                    value={state.status?.id}
                    onChange={(e) =>
                      setState({
                        ...state,
                        status: getValueList(Status).find(
                          (item) => item.id === e.target.value
                        )!
                      })
                    }
                  >
                    {getValueList(Status).map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.caption}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.modelState?.status}</FormHelperText>
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.acquisition)}
                >
                  <InputLabel id="acquisition-label">Acquisition</InputLabel>
                  <Select
                    labelId="acquisition-label"
                    label="Acquisition"
                    value={state.acquisition?.id}
                    onChange={(e) =>
                      setState({
                        ...state,
                        acquisition: getValueList(Acquisition).find(
                          (item) => item.id === e.target.value
                        )!
                      })
                    }
                  >
                    {getValueList(Acquisition).map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.caption}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors?.modelState?.acquisition}
                  </FormHelperText>
                </FormControl>
              </Stack>
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
