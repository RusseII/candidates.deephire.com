import React, { useContext, useState } from 'react'
import { Card, Rate, Input, Button, message, Form } from 'antd'
import { trackAnalytics, sendEmail } from '@/services/api'
import {ShortListContext} from '../../layouts'

const FeedbackCard = ({ shortList, setShortListData, num, rating, feedback, setControlKeys }) => {
    const { name }= useContext(ShortListContext)

    const [loading, setLoading] = useState(false)
    const [feedbackLeft, setFeedbackLeft] = useState(false)

    const onFinish = async (values) => {
        setLoading(true)
        const { rating, feedback } = values
        const { shortListData } = shortList
        const timestamp = Date.now()
        const fb = {timestamp, feedback, rating}
        shortListData[0].interviews[num]['fb'] =  shortListData[0].interviews[num]['fb'] || {}

        shortListData[0].interviews[num]['fb'][name] = fb
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

export default FeedbackCard