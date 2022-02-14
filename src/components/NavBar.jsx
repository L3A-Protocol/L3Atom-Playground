import React from 'react'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'

export default function NavBar() {
  return (
    <AppBar className="navbar">
        <Toolbar disableGutters>
            <Typography variant="h5" className="logo">
              <a style={{textDecoration: "none", color: "white"}} href="https://www.gda.fund/">
                G
              </a>
            </Typography>
            <Typography variant="h6" className="title">
                L3 Atom Playground
            </Typography>
        </Toolbar>
    </AppBar>
  )
}
