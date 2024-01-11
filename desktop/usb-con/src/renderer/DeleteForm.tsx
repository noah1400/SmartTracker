import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

const DeleteForm = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: '#2a2a2a',
          color: 'white',
        },
        '& .MuiInputBase-input': {
          color: 'white',
        },
        '& .MuiInputLabel-root': {
          color: 'white',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'white',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white',
          },
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Delete Project</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <DialogContentText sx={{color:'white'}}>
          Are you sure you want to delete this project?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', marginBottom:'8px' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="primary" autoFocus variant='contained'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteForm;
