import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { Player, BigPlayButton } from 'video-react';
import "video-react/dist/video-react.css"; // import css for video player
import './App.css';


const styles = {
    card: {
        maxWidth: 600,
    },
    media: {
        height: 200,
    },
};

function handleClick(videoURL) {

    alert('helo')
};

function SimpleMediaCard(props) {
    const { classes } = props;
    return (
        <div style={{ marginBottom: 30 }}>
            <div className="cardContainer" >
                <Typography >
                    <Player poster={props.thumbnail} fluid={true}>
                        <BigPlayButton position="center" />
                        <source src={props.videoURL} />
                    </Player>
                    <div style={{ backgroundColor: 'rgba(47, 105, 248, .85)', color: 'white', paddingTop: 5, paddingBottom: 5 }}>
                        Question {props.number + 1}
                    </div>
                </Typography>
            </div>
            <Typography className="questionText" component="p" style={{ marginTop: 15 }}>
                {props.question_text}
            </Typography>

        </div>
    );
}

SimpleMediaCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleMediaCard);
