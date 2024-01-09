import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';

const ProjectInfoForm = ({ open, onClose, project }) => {
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    const fetchTimeEntries = async () => {
      if (project && project.id) {
        try {
          const entries = await window.smarttracker.getTimeEntriesByProject(project.id);
          setTimeEntries(entries);
        } catch (error) {
          console.error('Error fetching time entries:', error);
          // Handle errors appropriately
        }
      }
    };

    if (open) {
      fetchTimeEntries();
    }
  }, [open, project]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Project Info</DialogTitle>
      <DialogContent>
        <List>
          {timeEntries.map((entry, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Entry ${index + 1}`} secondary={`Time: ${entry.time}`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInfoForm;
