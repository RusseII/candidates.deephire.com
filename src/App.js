import React, { Component } from 'react';
import logo from './img/logos/deephitewhite.png';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player'

import CardComponent from './CardComponent'

import './App.css';
const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
};

class App extends Component {
  constructor(){
    super();
    this.state = {
      questionDataToRender: [],
      questionData: [],
    };

  }

  componentDidMount(){
    fetch('https://api.deephire.io/v1.0/get_candidate_videos/436b04b53380061c94c6669fb752c00383a1a4b4dbbc213e4f4602039252ece9:e00821faf1a24d19be748a78b0f5e442/emerson%20cloud')
    .then(results => {
       return (results.json())
    }).then( data => {
      let arrayOfResponses = data.map((objKey) => {
        console.log(objKey)
        this.setState({questionData: objKey})
        return(
            <div key={objKey._id.$oid}>
                  <CardComponent testing="HEY" video={objKey.response_url} question_text={objKey.question_text}/>
            </div>
          )
         
      })
      this.setState({questionDataToRender: arrayOfResponses});
      console.log("state", this.state.questionData)
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Meet {this.state.questionData.user_name}!</h1>
        </header>


        <div className="pageBody">
          {this.state.questionDataToRender}
        </div>
      </div>
    );
  }
}

export default App;
