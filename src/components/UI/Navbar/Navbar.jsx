import React from 'react';
import {NavLink} from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
    return(
        <nav className='navbar'>
            <div className='navbar__links text'>
                <NavLink className='link' to="/">Main</NavLink>
                <NavLink className='link' to='/about'>About</NavLink>
                {/* <Link className='l' to='/'>На главную</Link>
                <Link className='l' to='/about'>О проекте</Link> */}
            </div>
        </nav>
    );
};

export default Navbar;