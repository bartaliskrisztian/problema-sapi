import React  from 'react';
import Report from "./components/Report";
import firebase from "./firebase/index";


function App() {

  /*
  console.log(firebase.db);
  firebase.db.collection('todo').add({title: 'first todo', description: 'new todo' })
    .then(documentReference => {
      console.log('document reference ID', documentReference.id)
    })
    .catch(error => {
      console.log(error.message)
    })
    */
  return (
    <div className="App">
      <Report />
    </div>
  );
}

export default App;
