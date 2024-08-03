export type UserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export const getUserInfoFromUser = (user: any): UserData | undefined => {
  return user
    ? {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    : undefined;
};

export const getUserFromRequest = (req: any) => {
  const user =
    req && req.session && req.session.passport
      ? req.session.passport['user']
      : undefined;
  return user;
};

export const setUserInRequest = (req: any, user?: any) => {
  if (req && req.session) {
    req.session['user'] = user;
  }
};
