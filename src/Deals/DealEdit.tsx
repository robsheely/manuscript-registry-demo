import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Deal, DealManuscript } from './Deal.entity'
import { remult, repo } from 'remult'
import { ErrorInfo } from 'remult'

import { AccountManager } from '../AccountManagers/AccountManager.entity'
import { Author } from '../Authors/Author.entity'
import { DealTypes } from './DealType'
import { DealStages } from './DealStage'
import { Manuscript } from '../Manuscripts/Manuscript.entity'

const dealRepo = remult.repo(Deal)

interface IProps {
  deal: Deal
  onClose: () => void
  onSaved: (deal: Deal) => void
}

export const DealEdit: React.FC<IProps> = ({ deal, onSaved, onClose }) => {
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>(
    deal.accountManager ? [deal.accountManager] : []
  )
  const [authors, setAuthors] = useState<Author[]>(
    deal.author ? [deal.author] : []
  )
  const [authorManuscripts, setAuthorManuscripts] = useState<Manuscript[]>([])
  const [selectedManuscripts, setSelectedManuscripts] = useState<Manuscript[]>(
    []
  )
  useEffect(() => {
    remult.repo(AccountManager).find().then(setAccountManagers)
    if (deal.id)
      repo(Deal)
        .relations(deal)
        .manuscripts.find({
          include: {
            contact: true
          }
        })
        .then((dc) => {
          const manuscripts = dc
            .filter((dc) => dc.contact)
            .map((dc) => dc.contact)
          setAuthorManuscripts((authorManuscripts) =>
            authorManuscripts.length === 0 ? manuscripts : authorManuscripts
          )
          setSelectedManuscripts(manuscripts)
        })
  }, [deal])
  const [authorSearch, setAuthorSearch] = useState('')
  useEffect(() => {
    repo(Author)
      .find({ where: { name: { $contains: authorSearch } }, limit: 20 })
      .then((x) => setAuthors(x))
  }, [authorSearch])

  const [state, setState] = useState(deal)

  useEffect(() => {
    repo(Manuscript)
      .find({ where: { author: [state.author] } })
      .then(setAuthorManuscripts)
    setSelectedManuscripts([
      ...selectedManuscripts.filter((sc) => sc.author?.id === state.author?.id)
    ])
  }, [state.author])

  const [errors, setErrors] = useState<ErrorInfo<Deal>>()
  const handleClose = () => {
    onClose()
  }
  const handleSave = async () => {
    const ref = dealRepo.getEntityRef(deal)
    try {
      setErrors(undefined)
      deal = Object.assign(deal, state)
      await deal.saveWithManuscripts!(selectedManuscripts.map((c) => c.id!))
      onSaved(deal)
      handleClose()
    } catch (err: any) {
      setErrors(err)
      ref.undoChanges()
    }
  }

  return (
    <div>
      <Dialog open={Boolean(deal)} onClose={handleClose}>
        <DialogTitle>{!deal.id ? 'Create ' : 'Update '} Deal</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }} noValidate autoComplete="off">
            <Stack spacing={2}>
              <TextField
                autoFocus
                label="Deal name"
                error={Boolean(errors?.modelState?.name)}
                helperText={errors?.modelState?.name}
                fullWidth
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
              />
              <TextField
                label="Description"
                multiline
                error={Boolean(errors?.modelState?.description)}
                helperText={errors?.modelState?.description}
                fullWidth
                value={state.description}
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
              />
              <FormControl
                sx={{ flexGrow: 1 }}
                error={Boolean(errors?.modelState?.accountManager)}
              >
                <Autocomplete
                  disablePortal
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  id="combo-box-demo"
                  getOptionLabel={(c) => c.name}
                  options={authors}
                  value={state.author ? state.author : null}
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
              <FormControl sx={{ flexGrow: 1 }}>
                <Autocomplete
                  disablePortal
                  multiple
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  id="combo-box-demo"
                  getOptionLabel={(c) => c.firstName + ' ' + c.lastName}
                  options={authorManuscripts}
                  value={selectedManuscripts}
                  onChange={(e, newValue: Manuscript[] | null) =>
                    setSelectedManuscripts(newValue ? newValue : [])
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Manuscripts" />
                  )}
                />
              </FormControl>
              <Stack direction="row" spacing={2}>
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.stage)}
                >
                  <InputLabel id="stage-label">Stage</InputLabel>
                  <Select
                    labelId="stage-label"
                    label="Stage"
                    value={state.stage}
                    onChange={(e) =>
                      setState({ ...state, stage: e.target.value })
                    }
                  >
                    <MenuItem value={''}>None</MenuItem>
                    {DealStages.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.modelState?.stage}</FormHelperText>
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1 }}
                  error={Boolean(errors?.modelState?.type)}
                >
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    label="Type"
                    value={state.type}
                    onChange={(e) =>
                      setState({ ...state, type: e.target.value })
                    }
                  >
                    <MenuItem value={''}>None</MenuItem>
                    {DealTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.modelState?.type}</FormHelperText>
                </FormControl>
              </Stack>

              <TextField
                label="Amount"
                error={Boolean(errors?.modelState?.amount)}
                type="number"
                helperText={errors?.modelState?.amount}
                fullWidth
                value={state.amount}
                onChange={(e) =>
                  setState({ ...state, amount: +e.target.value })
                }
              />

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
                  value={accountManagers && (state.accountManager?.id || '')}
                  onChange={(e) =>
                    setState({
                      ...state,
                      accountManager: accountManagers?.find(
                        (x) => x.id === e.target.value
                      )!
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
