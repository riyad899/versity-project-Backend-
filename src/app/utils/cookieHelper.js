
export const setAuthCookies = (res, cookieHeader, token) => {
  if (cookieHeader) {
    res.setHeader('Set-Cookie', cookieHeader);
  }
};

export default setAuthCookies;
