import React from 'react'
import NavbarLogo from './NavBarLogo/NavbarLogo'
import classes from './NavBar.module.css'


const NavBar = props => {
    return (
        <div className={classes.Container}>
            <NavbarLogo />
            <div className={classes.Break}></div>
            <div className={classes.Subtext}>A Try Pencil Interview Task</div>
        </div>
    )
}

export default NavBar
