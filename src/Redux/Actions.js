let nextId = 0;

export const addData = (id, firstName, lastName, email, phone, address, description) => {
  if (id === null) {
    return {
      type: "ADD_DATA",
      payload: {
        id: ++nextId,
        firstName,
        lastName,
        email,
        phone, 
        address,
        description
      },
    };
  } else {
    return {
      type: "ADD_DATA",
      payload: {
        id,
        firstName,
        lastName,
        email,
        phone,
        address,
        description
      },
    };
  }
};

export const setDataAmount = (number) => {
  return {
    type: "DATA_AMOUNT",
    payload: number
  }
}