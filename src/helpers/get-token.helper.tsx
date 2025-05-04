export const accessToken = () => {
  const data = sessionStorage.getItem(
    `oidc.user:${import.meta.env.VITE_AUTHORITY}:${import.meta.env.VITE_CLIENT_ID}`
  );
  if(!data){
    return "";
  }
  const parseToken = JSON.parse(data!);
  const accessToken = parseToken.access_token;
  return accessToken;
};
