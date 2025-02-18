export const accessToken = () => {
  const data = sessionStorage.getItem(
    "oidc.user:https://id.tif.uin-suska.ac.id/realms/tif:iMemoraise"
  );
  if(!data){
    return "";
  }
  const parseToken = JSON.parse(data!);
  const accessToken = parseToken.access_token;
  return accessToken;
};
