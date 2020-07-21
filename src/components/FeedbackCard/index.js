import React, { useState } from 'react'
import { Card, Rate, Input, Button, message, Form } from 'antd'
import { trackAnalytics, sendEmail } from '@/services/api'



const FeedbackCard = ({ shortList, setShortListData, num, rating, feedback, setControlKeys }) => {

    const [loading, setLoading] = useState(false)
    const [feedbackLeft, setFeedbackLeft] = useState(false)

    const onFinish = async (values) => {
        setLoading(true)
        const { rating, feedback } = values
        const { shortListData } = shortList

        shortListData[0].interviews[num]['feedback'] = feedback;
        shortListData[0].interviews[num]['rating'] = rating;
        await trackAnalytics(shortListData[0]._id, shortListData[0]);
        setLoading(false)
        message.success("Feedback Saved")

        if (!feedbackLeft) {
            const { _id, name, email, createdBy } = shortListData[0]
            // below is hacky, the last field is the "sharelink name" and i wanted to put the sharelink data inside of that. 
            sendEmail('feeback-left-on-share-link', _id, name, email, createdBy, `sharelink: ${feedback}`);
            setFeedbackLeft(true)
        }

        setShortListData(shortListData)

    }

    return (
        <Card title="Please leave feedback about this candidate">
            <Form onFinish={onFinish} initialValues={{ rating, feedback }}>
                <Form.Item name='rating' rules={[{ required: true, message: 'Please rate the candidate' }]}>
                    <Rate
                        allowClear={false}
                    />
                </Form.Item>
                <Form.Item name='feedback'>
                    <Input.TextArea
                        onFocus={() => setControlKeys(false)}
                        onBlur={() => setControlKeys(true)}
                        placeholder="What did you think of this candidate?"
                        autosize
                    />
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} htmlType="submit" type="primary">
                        Save Feedback
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


// const storeFeedback = (shortlistData, num, shortListId, feedback, rating) => {
//     shortlistData.interviews[num]['feedback'] = text;
//     shortlistData.interviews[num]['rating'] = rating;
//     trackAnalytics(shortListId, shortlistData);
// };

export default FeedbackCard