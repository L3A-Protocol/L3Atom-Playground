import React from 'react'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'

export default function NavBar() {
  return (
    <AppBar position="static" className="navbar">
        <Toolbar disableGutters>
            <img className="gda-logo" src={require('../images/GDA_logo.png')} alt="GDA logo"/>
            <Typography variant="h6" className="title">
                L3 Atom Playground
            </Typography>
        </Toolbar>
    </AppBar>
  )
}
