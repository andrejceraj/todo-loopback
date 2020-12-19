export const getCurrentUser = () => {
  if(localStorage.getItem("user") && localStorage.getItem("userId")){
    return {id: localStorage.getItem("userId"), username: localStorage.getItem("user")};
  }
  return undefined;
}