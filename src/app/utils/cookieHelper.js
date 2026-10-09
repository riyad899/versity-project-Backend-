export const setAuthCookies = (res, cookieHeader, token) => {
  if (cookieHeader) {
    res.setHeader('Set-Cookie', cookieHeader);
  }

  if (token) {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('better-auth.session_token', token, cookieOptions);
    res.cookie('session_token', token, cookieOptions);
  }
};

export default setAuthCookies;
