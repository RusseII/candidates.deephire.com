import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ReactPlayer from 'react-player'
import Modal from 'material-ui/Modal';


const styles = {
    card: {
        maxWidth: 345,
    },
    media: {
        height: 200,
    },
};

function handleClick(videoURL){
    
    alert('helo')
  };

function SimpleMediaCard(props) {
    const { classes } = props;
    return (
        <div>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image={props.video_thumbnail}
                    title="Press play to see the candidate answer your question! "

                >
                    
                </CardMedia>
                <CardContent>
                    <Typography variant="headline" component="h2">
                        {/* {props.testing} */}
                    </Typography>
                    <Typography component="p">
                        {props.question_text}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => handleClick(props.response_url)}>
            PLAY
          </Button>
          {/* <Button size="small" color="primary">
            Learn More
          </Button> */}
                </CardActions>
            </Card>
        </div>
    );
}

SimpleMediaCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleMediaCard);
