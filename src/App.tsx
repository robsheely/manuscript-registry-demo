import { useState } from 'react';

import SignInAndUp from './SignIn/SignInAndUp';
import MainPage from './MainPage';
import { getUserInfoFromUser, UserData } from './utils/userUtils';

const App = () => {
  const [currentUser, _setCurrentUser] = useState<UserData>();

  const setCurrentUser = (user: UserData | undefined) => {
    const userInfo = getUserInfoFromUser(user);
    _setCurrentUser(userInfo);
  };

  const signOut = async () => {
    await fetch('/api/signOut', {
      method: 'POST',
    });
    setCurrentUser(undefined);
  };

  if (!currentUser) {
    return (
      <SignInAndUp currentUser={currentUser} setCurrentUser={setCurrentUser} />
    );
  }
  return <MainPage currentUser={currentUser} logout={signOut} />;
};

export default App;
