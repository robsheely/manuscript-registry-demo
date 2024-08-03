import { useState } from 'react'
import { remult, UserInfo } from 'remult'

import SignInAndUp from './SignIn/SignInAndUp'
import MainPage from './MainPage'


const App = () => {
  const [currentUser, _setCurrentUser] = useState<UserInfo>()

  const setCurrentUser = (user: UserInfo | undefined) => {
    remult.user = user
    _setCurrentUser(user)
  }

  const signOut = async () => {
    await fetch('/api/signOut', {
      method: 'POST'
    })
    setCurrentUser(undefined)
  }

  if (!currentUser) {
    return <SignInAndUp currentUser={currentUser} setCurrentUser={setCurrentUser} />
  }
  return <MainPage logout={signOut} />
}

export default App
