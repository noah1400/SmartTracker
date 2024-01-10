import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import ClearIcon from '@mui/icons-material/Clear';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { Project } from './types';
import { Grid, SpeedDialIcon } from '@mui/material';
import ProjectForm from './ProjectForm';
import DeleteForm from './DeleteForm';
import ProjectInfoForm from './ProjectInfoForm';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import InfoIcon from '@mui/icons-material/Info';

interface ProjectOptionsProps {
  activeProject: Project | null;
  activeColor: string;
}

export default function ProjectOptions({
  activeProject,
  activeColor,
}: Readonly<ProjectOptionsProps>) {
  const [formOpen, setFormOpen] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [syncAlert, setSyncAlert] = useState({ open: false, message: '' });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Project deleted');
    // Add your delete logic here
    setDeleteDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleOpenForm = () => {
    setFormOpen(true);
  };
  const onReset = () => {
    setResetForm(false);
  };
  const handleEdit = () => {
    console.log('Edit');
  };
  const handleNewProject = async (name: string, description: string) => {
    try {
      const response = await window.smarttracker.addProject(name, description);
      if (response.success) {
        console.log('Project added');
        setResetForm(true);
        console.log(syncAlert);
        setSyncAlert({ open: true, message: 'Project created' });
      } else {
        console.log('Failed to add project', response.error);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };
  const handleCloseAlert = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setSyncAlert({ ...syncAlert, open: false });
  };

  const handleInfo = () => {
    console.log('Info');
  };

  console.log(syncAlert);

  return (
    <Box>
      <Box
        sx={{
          height: 70,
          transform: 'translateZ(0px)',
          flexGrow: 1,
          position: 'relative',
        }}
      >
        <SpeedDial
          ariaLabel="Edit Project"
          direction="up"
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            '& .MuiFab-root': {
              backgroundColor: 'white',
            },
            '& .MuiFab-root:hover': {
              backgroundColor: activeColor,
            },
          }}
          icon={
            <SpeedDialIcon
              icon={<EditIcon sx={{ color: '#282a2c' }} />}
              openIcon={
                <ClearIcon
                  sx={{
                    color: 'black',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                />
              }
            />
          }
        >
          <SpeedDialAction
            icon={<InfoIcon sx={{ color: '#282a2c' }} />}
            onClick={handleInfo}
            tooltipTitle="Infos"
            sx={{
              '& .MuiSvgIcon-root:hover': {
                color: 'white',
              },
            }}
          />
          <SpeedDialAction
            icon={<EditIcon sx={{ color: '#282a2c' }} />}
            onClick={handleEdit}
            tooltipTitle="Edit"
            sx={{
              '& .MuiSvgIcon-root:hover': {
                color: 'white',
              },
            }}
          />
          <SpeedDialAction
            icon={<AddIcon sx={{ color: '#282a2c' }} />}
            onClick={handleOpenForm}
            tooltipTitle="New"
            sx={{
              '& .MuiSvgIcon-root:hover': {
                color: 'white',
              },
            }}
          />
          <SpeedDialAction
            icon={<DeleteForeverRoundedIcon sx={{ color: '#282a2c' }} />}
            onClick={handleDelete}
            tooltipTitle="Delete"
            sx={{
              '& .MuiSvgIcon-root:hover': {
                color: 'white',
              },
            }}
          />
        </SpeedDial>
        <ProjectForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleNewProject}
          resetForm={resetForm}
          onReset={onReset}
        />
        <DeleteForm
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={confirmDelete}
        />
      </Box>
      <Snackbar
          open={syncAlert.open}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1400 }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: '100%' }}
          >
            {syncAlert.message}
          </Alert>
        </Snackbar>
    </Box>
  );
}
