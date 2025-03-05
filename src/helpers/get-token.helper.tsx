export const accessToken = () => {
  const data = sessionStorage.getItem(
    `oidc.user:https://id.tif.uin-suska.ac.id/realms/tif:${import.meta.env.VITE_CLIENT_ID}`
  );
  if(!data){
    return "";
  }
  const parseToken = JSON.parse(data!);
  const accessToken = parseToken.access_token;
  return accessToken;
};
