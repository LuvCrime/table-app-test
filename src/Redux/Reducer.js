import update from "immutability-helper";

const initialState = {
  data: [

  ],
  dataAmount: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_DATA":
      return update(state, { data: { $push: [action.payload] } });
      case "DATA_AMOUNT": 
      return update(state, {
        dataAmount: {$set: action.payload}
      })
    default:
      return state;
  }
};

export default reducer;
