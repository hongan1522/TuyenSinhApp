import { createContext, useReducer } from "react";

const MyContext = createContext();

const initialState = {
  token: null,
  username: null,
  avatar: null,
  role: null,
  // Add other user details as needed
};

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { 
        ...state, 
        token: action.payload.token, 
        username: action.payload.username, 
        avatar: action.payload.avatar,
        role: action.payload.role, };
    case "logout":
      return { ...initialState };
    default:
      return state;
  }
};

export const MyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MyContext.Provider value={[state, dispatch]}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
