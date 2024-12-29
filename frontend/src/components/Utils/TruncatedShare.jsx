import React from 'react';
import { Button, Typography } from '@material-tailwind/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const TruncatedShare = ({ share }) => {
    const truncatedShare = share ? `${share.slice(0, 6)}...${share.slice(-6)}` : 'N/A';
  
    return (
      <div className="flex items-center">
        <Typography variant="body1" color="blue-gray" className="mr-2">
          Share: {truncatedShare}
        </Typography>
        <CopyToClipboard text={share}>
          <Button color="blue-gray" size="sm">Copy</Button>
        </CopyToClipboard>
      </div>
    );
  };

  export default TruncatedShare;