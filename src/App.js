import React, { Component } from "react";
import logo from "./img/logos/horizontalresize.png";
import { render } from "react-dom";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import {
  Container,

  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
  Tooltip,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";


import { Player, BigPlayButton } from "video-react";
import { Button, Comment, Form, Header } from "semantic-ui-react";
import { Modal, Card, Col, Row, Layout } from "antd"
import bill from './img/bill.jpg'
import mirelle from './img/mirelle.png'
import anna from './img/anna.jpeg'

// import 'semantic-ui-css/semantic.min.css';

import "video-react/dist/video-react.css"; // import css for video player
import "./App.css";
var readableTime = require('readable-timestamp');
const { Meta } = Card;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeQuestion: null,
      modal: false,
      userNameModal: false,
      comments: [],
      width: 0,
      height: 0

    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.getName = this.getName.bind(this);
    this.createPaginationButtons = this.createPaginationButtons.bind(this);
    this.handlePaginationButton = this.handlePaginationButton.bind(this);
    this.getComments = this.getComments.bind(this)
    this.createComment = this.createComment.bind(this)
    this.toggle = this.toggle.bind(this);
    this.toggleUserNameModal = this.toggleUserNameModal.bind(this);
    this.submitUserName = this.submitUserName.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.updateInputValueComments = this.updateInputValueComments.bind(this);
    this.submitComments = this.submitComments.bind(this);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }


  submitComments() {
    // grab the updated commentChain from state
    var data = this.state.candidateData[this.state.activeQuestion]
    console.log("submitting comment")
    console.log(data)

    // dev url
    // var url = 'http://0.0.0.0:3001/v1.0/add_video_comment'

    // post it to server
    var url = 'https://api.deephire.io/v1.0/add_video_comment';

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    // wipe the input text field
    this.setState({ inputCommentField: '' })


  }
  toggleUserNameModal() {
    this.setState({
      userNameModal: !this.state.userNameModal
    });

  }

  createComment(e) {
    if (this.state.commentTextInputValue) {


      if (localStorage.getItem('authorName')) {
        // grab all the comment information
        var time = new Date();
        var messageObject = {
          'message': this.state.commentTextInputValue,
          'author': localStorage.getItem('authorName'),
          'timestamp': time.toString()
        }
        // add new comment to the candidateData state variable
        var data = this.state.candidateData
        var commentChain = this.state.candidateData[this.state.activeQuestion]['comments']
        // if not comments have existed for this question, initialize the comments array
        if (!commentChain) {
          commentChain = []
        }
        // add comment to chain
        commentChain.push(messageObject)
        data[this.state.activeQuestion]['comments'] = commentChain
        // set state with new comment
        this.setState({ candidateData: data })
        // re-render page with the new comment
        this.getComments(this.state.activeQuestion)
        // store comment to database
        this.submitComments()
        this.setState({ commentTextInputValue: '' })
      } else {
        // author name has not been collected yet
        this.toggleUserNameModal()
      }
    }
  }

  getComments(activeQuestion) {
    var comments = []

    // if no comments has existed yet
    if (!this.state.candidateData[activeQuestion]['comments']) {
      this.setState({ comments: 'No one has commented on this video yet! Share your thoughts below.' })
      return
    }
    // loop over all existing comments and create commenting objects
    // TODO make this nicer by separating Comments into its own component, and pass in props
    for (var i = 0; i < this.state.candidateData[activeQuestion]['comments'].length; i++) {
      var dateObj = new Date(this.state.candidateData[activeQuestion]['comments'][i]['timestamp'])
      var displayTime = (readableTime(dateObj))
      comments.push(
        <Comment>
          <Comment.Content>
            <Comment.Author as="a">
              {this.state.candidateData[activeQuestion]['comments'][i]['author']}
            </Comment.Author>
            <Comment.Metadata>
              <div>
                {displayTime}
              </div>
            </Comment.Metadata>
            <Comment.Text>
              {this.state.candidateData[activeQuestion]['comments'][i]['message']}
            </Comment.Text>
          </Comment.Content>
        </Comment>
      );
    }
    // update state with the comments
    this.setState({ comments: comments })
  }

  // load the new source video for the video player
  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeQuestion != prevState.activeQuestion) {
      this.refs.player.load();
    }
  }

  // make pagination buttons functional
  handlePaginationButton(e, position) {
    e.persist();
    this.setState({
      activeQuestion: e.target.id
    }, () => {
      this.getComments(e.target.id)
    });
  }

  // create buttons for pagination
  createPaginationButtons() {
    var paginationButtons = [];
    for (var i = 0; i < this.state.candidateData.length; i++) {
      paginationButtons.push(
        <PaginationItem>
          <PaginationLink
            href="#"
            id={i}
            onClick={e => this.handlePaginationButton(e, i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    this.setState({
      paginationButtons: paginationButtons
    });
  }

  getName() {
    return this.state.candidateData[0]["user_name"];
  }
  // toggle signup email modal
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }


  // pull URL GET parameters
  GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }
  // find %20, %40 in a string and replaces with a ' ' and '@' respectively
  CleanVariable(res) {
    if (res === undefined) return;
    else {
      var res = res.replace(/%20/g, " ");
      var res = res.replace(/%40/g, "@");
      return res;
    }
  }

  componentDidMount() {

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);


    var company_token = this.CleanVariable(this.GetURLParameter("company"));
    var user_token = this.CleanVariable(this.GetURLParameter("candidate"));
    /* test data: 
    ?company=436b04b53380061c94c6669fb752c00383a1a4b4dbbc213e4f4602039252ece9:e00821faf1a24d19be748a78b0f5e442&candidate=emerson%20cloud 
    var company_token = '436b04b53380061c94c6669fb752c00383a1a4b4dbbc213e4f4602039252ece9:e00821faf1a24d19be748a78b0f5e442'
    var user_token = 'emerson%20cloud'
    */
    var url = "https://api.deephire.io/v1.0/get_candidate_videos/";

    fetch(url + company_token + "/" + user_token)
      .then(results => {
        return results.json();
      })
      .then(
      data => {
        this.setState({
          candidateData: data,
          activeQuestion: 0
        }, () => { this.getComments(this.state.activeQuestion); this.createPaginationButtons() });
      },
      () => {
        this.setState({
          requestFailed: true
        });
      }
      );
  }

  updateInputValueComments(evt) {
    this.setState({
      commentTextInputValue: evt.target.value,
      inputCommentField: evt.target.value
    });

  }

  updateInputValue(evt) {
    this.setState({
      userNameInputValue: evt.target.value
    });
  }

  submitUserName(e) {
    this.toggleUserNameModal();
    if (this.state.userNameInputValue) {
      localStorage.setItem('authorName', this.state.userNameInputValue), (this.createComment(null));

    }
  }
  render() {
    if (!this.state.candidateData) return <p>Loading...</p>;
    if (this.state.comments === null) return <p> Loading! </p>;
    if (this.state.activeQuestion === null) return <p> Loading questions... </p>;
    if (this.state.requestFailed) return <p>Failed!</p>;

    return <div className="App">
      {/* NAVBAR */}
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">
          <img style={{ height: 34, width: 133.45 }} src={logo} />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Button onClick={() => window.openChat()}>
                Feedback
                </Button>
            </NavItem>
            <NavItem>
              <Button basic color="green" onClick={this.toggle}>
                More Candidates Like This
                </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>

      <Container fluid>
        <Row>
          <Col span={7}>
            {/* Meet Candidate Card */}
            <div className="cardContainer">
              <div className="cardContent">
                <h1>Meet {this.getName()}!</h1>
                <div style={{ marginBottom: 10, marginTop: 10 }} />
              </div>
            </div>
            <div style={{ marginTop: 20, marginBottom: 20, color: "#9B9B9B" }}>
              <b>Comments</b>
            </div>
            {/* Comments Card */}
            <div className="comments cardContainer">
              <div className="cardContent" style={{ padding: 10 }}>
                <Comment.Group>
                  {this.state.comments}
                  <Form reply>
                    <Form.TextArea value={this.state.inputCommentField} onChange={evt => this.updateInputValueComments(evt)} />
                    <Button content="Add Reply" labelPosition="left" icon="edit" primary onClick={e => this.createComment(e)} />
                  </Form>
                </Comment.Group>
              </div>
            </div>
          </Col>
          <Col span={1} />
          <Col span={16} >
            {/* Video Player Card */}
            <div style={{ padding: 12 }} className="cardContainer">
              <div className="cardContents">
                <div style={{ paddingBottom: 20 }}>
                  {" "}
                  <b style={{ fontSize: "large" }}>
                    Q{Number(this.state.activeQuestion) + 1} -{" "}
                  </b>
                  {this.state.candidateData[this.state.activeQuestion]["question_text"]}{" "}
                </div>
                {/* <div style={{ height: 300, width: 'auto' }}> */}
                <Player fluid={false} height={this.state.height * .65} ref="player" videoId="video-1">
                  <source src={this.state.candidateData[this.state.activeQuestion]["response_url"]} />
                  <BigPlayButton position="center" />
                </Player>
                {/* </div> */}
                {/* Pagination Buttons */}
                <Pagination size="lg" aria-label="question navigation">
                  {this.state.paginationButtons}
                </Pagination>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* SOURCING TOOL EMAIL MODAL */}
      <Modal
        title="Top Fit Candidate"
        visible={this.state.modal}
        onOk={this.toggle}
        onCancel={this.toggle}
        width={1000}
      >
        Want to see more candidates just like {this.getName()}? <br /> <br />
        <Row gutter={16}>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 290 }}
              cover={<img alt="bill" src={bill} />}
            >
              <Meta
                title="Bill Marchetti"
                description="Account Executive"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 250 }}
              cover={<img alt="Anna" src={anna} />}
            >
              <Meta
                title="Anna Avery"
                description="Telesales Rep"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={<img alt="Mirelle Kutya" src={mirelle} />}
            >
              <Meta
                title="Mirelle Kutya"
                description="Outbound Sales Manager"
              />
            </Card>
          </Col>
        </Row>
      </Modal>

      {/* ADD USER NAME MODAL */}
      <Modal
        title="Add Name to Comment"
        visible={this.state.userNameModal}
        onOk={this.submitUserName}
        onCancel={this.toggleUserNameModal}
      >
        Add your name below to post your comment. <br />
        <InputGroup>
          <Input onChange={evt => this.updateInputValue(evt)} placeholder="Steven Gates" />
        </InputGroup>

      </Modal>



    </div >;
  }
}

export default App;
