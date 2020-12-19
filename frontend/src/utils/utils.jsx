export const getCurrentUser = () => {
  if(localStorage.getItem("user") && localStorage.getItem("userId")){
    return {id: localStorage.getItem("userId"), username: localStorage.getItem("user")};
  }
  return undefined;
}

export const getFilterFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get('filter');
  return filter;
}