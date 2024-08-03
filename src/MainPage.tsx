import { Route, Routes } from 'react-router-dom'
import { AuthorsList } from './Authors/AuthorsList'
import { ManuscriptsPage } from './Manuscripts/ManuscriptsPage'
import { AuthorShow } from './Authors/AuthorShow'
import {
    Box,
    createTheme,
    CssBaseline,
    GlobalStyles,
    ThemeProvider,
} from '@mui/material'
import { ManuscriptShow } from './Manuscripts/ManuscriptShow'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Header from './components/Header'
const theme = createTheme()


const MainPage = ({ logout }: { logout: () => void }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    body: { backgroundColor: '#fafafa' }
                }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Header logout={logout} />
                <Box sx={{ p: 1 }}>
                    <Routes>
                        <Route path="/" element={<ManuscriptsPage />} />
                        <Route path="/authors" element={<AuthorsList />} />
                        <Route path="/authors/:id" element={<AuthorShow />} />
                        <Route path="/manuscripts/:id" element={<ManuscriptShow />} />
                    </Routes>
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    )
}

export default MainPage
