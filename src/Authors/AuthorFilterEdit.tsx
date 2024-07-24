import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  FormControlLabel,
  Switch
} from '@mui/material'
import { useState } from 'react'

type Props = {
  state: AuthorFilterState
  onClose: () => void
  onSaved: (newState: AuthorFilterState) => void
}

export type AuthorFilterState = {
  name: string
  published: boolean
  agented: boolean
}

export const AuthorFilterEdit: React.FC<Props> = ({
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

  return (
    <Dialog open={Boolean(state)} onClose={handleClose}>
      <DialogTitle>Author Filters</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 1 }} noValidate autoComplete="off">
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={newState.name}
              onChange={(e) => {
                setNewState({ ...newState, name: e.target.value })
              }}
            />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={0}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={newState.published}
                    onChange={(e) =>
                      setNewState({ ...newState, published: e.target.checked })
                    }
                  />
                }
                label="Has been published before."
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newState.agented}
                    onChange={(e) =>
                      setNewState({ ...newState, agented: e.target.checked })
                    }
                  />
                }
                label="Had an agent before."
              />
            </Stack>
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
