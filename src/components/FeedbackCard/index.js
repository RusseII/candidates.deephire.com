import React from 'react'
import { Card, Rate, Input, Button, message, Form } from 'antd'
import { trackAnalytics, sendEmail } from '@/services/api'



const FeedbackCard = ({shortlistData, shortlistId, num, rating, text, setControlKeys}) => {

    const onFinish = (values) => {
        const {rating, feedback} = values
        // sendEmail('feeback-left-on-share-link', _id, name, email, createdBy, feedback);
    
        shortlistData.interviews[num]['feedback'] = feedback;
        shortlistData.interviews[num]['rating'] = rating;
        trackAnalytics(shortlistData._id, shortlistData);
        console.log(values)
    
    }
    
    return (
    <Card title="Please Indicate Next Steps">
        <Form onFinish={onFinish}>
            <Form.Item name='rating' rules={[{ required: true, message: 'Please rate the candidate' }]}>
                <Rate
                    allowClear={false}
                    defaultValue={rating}
                />
            </Form.Item>
            <Form.Item name='feedback'>
                <Input.TextArea
                    onFocus={() => setControlKeys(false)}
                    onBlur={() => setControlKeys(true)}
                    defaultValue={text}
                    placeholder="What did you think of this candidate?"
                    autosize
                />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary">
                    Submit Next Steps
        </Button>
            </Form.Item>
        </Form>
    </Card>)
}


// const leaveFeedBackButton = () => {
//     message.success('Feedback Submitted');
//     storeFeedback();
//     if (this.state.feedbackEmailSent === false) {
//         //   this.setState({ feedbackEmailSent: true });
//         const { _id, name, email, createdBy, description } = this.state.shortlistData;
//         sendEmail('feeback-left-on-share-link', _id, name, email, createdBy, description);
//     }
// };


// const storeFeedback = (shortlistData, num, shortListId, text, rating) => {
//     shortlistData.interviews[num]['feedback'] = text;
//     shortlistData.interviews[num]['rating'] = rating;
//     trackAnalytics(shortListId, shortlistData);
// };

export default FeedbackCard