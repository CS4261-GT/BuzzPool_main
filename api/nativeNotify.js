
export const getDataUsingPost = () => {
  //POST json
  const dataToSend = { 
    appId: 7334,
    appToken: "d1AFABt39G4VjuJZ4ymIbt",
    title: "Push title here as a string",
    body: "Push message here as a string",
    dateSent: "4-11-2023 1:23PM"
    // pushData: { test: "test" },
    // bigPictureURL: ""
  };
  //making data to send on server
  // var formBody = [];
  // for (var key in dataToSend) {
  //   var encodedKey = encodeURIComponent(key);
  //   var encodedValue = encodeURIComponent(dataToSend[key]);
  //   formBody.push(String(encodedKey + '=' + encodedValue);
  // }
  // formBody = formBody.join('&');
  // console.log(formBody)
  //POST request
  const url = 'https://app.nativenotify.com/api/notification'
  const otherParams = {
    method: 'POST', //Request Type
    body: JSON.stringify(dataToSend), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json; charset=UTF-8',
    },
  }
  fetch(url, otherParams)
    .then((response) => {
      console.log(response)
      // return response.json()
    })
    // //If response is in json then in success
    // .then((responseJson) => {
    //   console.log(responseJson);
    //   // alert(JSON.stringify(responseJson));
      
    // })
    //If response is not in json then in error
    .catch((error) => {
      // console.log(error.message);
      // alert(JSON.stringify(error));
      console.error(error);
    });
};