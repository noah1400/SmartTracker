import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Project } from './types';

const ProjectInfoForm = ({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}) => {
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    const fetchTimeEntries = async () => {
      if (project && project.dataValues.localID) {
        try {
          const entries = await window.smarttracker.getProjectTimeEntries(
            project.dataValues.localID);
          console.log('Entries:', entries);
          setTimeEntries(entries || []);
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
          {timeEntries.map((timeentry, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Entry ${index + 1}`}
                //secondary={`Time: ${timeentry.dataValues.startTime}}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInfoForm;
