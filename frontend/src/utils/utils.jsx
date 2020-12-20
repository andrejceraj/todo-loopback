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

export const formatDate = (sqlDate) => {
  const date = new Date(Date.parse(sqlDate));
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate()
  let hour = date.getHours();
  let min = date.getMinutes();
  return `${day}.${month}.${year}. ${hour}:${min}`;
};