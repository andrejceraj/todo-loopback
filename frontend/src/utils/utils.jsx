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
  let year = sqlDate.substring(0, 4);
  let month = sqlDate.substring(5, 7);
  let day = sqlDate.substring(8, 10);
  let hour = sqlDate.substring(11, 13);
  let min = sqlDate.substring(14, 16);
  return `${day}.${month}.${year}. ${hour}:${min}`;
};