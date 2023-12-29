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
import { SpeedDialIcon } from '@mui/material';

interface ProjectOptionsProps {
  activeProject: Project | null;
}

const handleEdit = () => {
  console.log('Edit');
};
const handleNewProject = () => {
  console.log('New Project');
};
const handleDelete = () => {
  console.log('Delete');
};

export default function ProjectOptions({
  activeProject,
}: Readonly<ProjectOptionsProps>) {
  return (
    <Box sx={{ height: 70, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="Edit Project"
        direction='up'
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          '& .MuiFab-root': {
            backgroundColor: 'white',
          },
          '& .MuiFab-root:hover': {
            backgroundColor: activeProject
              ? `${activeProject.color}`
              : 'defaultColor',
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
          onClick={handleNewProject}
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
    </Box>
  );
}
