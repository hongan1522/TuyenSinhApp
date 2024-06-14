const MyUserReducer = (currentStage, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null;
    }
    return currentStage;
}

export default MyUserReducer;