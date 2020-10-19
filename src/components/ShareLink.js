/* eslint-disable camelcase */
import { ShareAltOutlined } from '@ant-design/icons';
import { Popover, Typography, Tooltip, Button } from 'antd';
import React, { useState } from 'react';

const ShareLink = () => {
  const [visibility, setVisibility] = useState({ hovered: false, clicked: false });

  return (
    <Tooltip
    placement="left"
    title="Share with your team"
    trigger="hover"
    visible={visibility.hovered}
    onVisibleChange={visible => setVisibility({ hovered: visible, clicked: false })}
  >
    <Popover
     placement="left"
      title="Share this link with other members on your team"
    content={<Typography.Text copyable>{window.location.href}</Typography.Text>}
      trigger="click"
      visible={visibility.clicked}
      onVisibleChange={visible => setVisibility({ hovered: false, clicked: visible })}
    >
            <Button icon={<ShareAltOutlined />}>Share</Button>
    </Popover>
    </Tooltip>
  );
};

export default ShareLink;
