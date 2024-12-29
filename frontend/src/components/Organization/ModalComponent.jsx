import React, { useState } from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import SubmitShareComponent from './SubmitShareComponent';
import DecryptAllQuestionsComponent from './DecryptAllQuestionsComponent';

const DialogComponent = () => {
  const [isSubmitShareDialogOpen, setIsSubmitShareDialogOpen] = useState(false);
  const [isDecryptAllQuestionsDialogOpen, setIsDecryptAllQuestionsDialogOpen] = useState(false);

  const toggleSubmitShareDialog = () => setIsSubmitShareDialogOpen(!isSubmitShareDialogOpen);
  const toggleDecryptAllQuestionsDialog = () => setIsDecryptAllQuestionsDialogOpen(!isDecryptAllQuestionsDialogOpen);

  return (
    <div className="p-4">
      <Button color="blue" onClick={toggleSubmitShareDialog}>
        Submit Share
      </Button>
      <Button color="green" onClick={toggleDecryptAllQuestionsDialog} className="ml-4">
        Decrypt All Questions
      </Button>

      <Dialog size="lg" open={isSubmitShareDialogOpen} onClick={toggleSubmitShareDialog}>
        <DialogHeader onClick={toggleSubmitShareDialog}>
          Submit Share
        </DialogHeader>
        <DialogBody>
          <SubmitShareComponent />
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={toggleSubmitShareDialog}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog size="lg" open={isDecryptAllQuestionsDialogOpen} onClick={toggleDecryptAllQuestionsDialog}>
        <DialogHeader onClick={toggleDecryptAllQuestionsDialog}>
          Decrypt All Questions
        </DialogHeader>
        <DialogBody>
          <DecryptAllQuestionsComponent />
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={toggleDecryptAllQuestionsDialog}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DialogComponent;
