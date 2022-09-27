import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useWeb3React } from "@web3-react/core"
import { createInjector } from '../../wallet/wallet'

const pages = [];

const ResponsiveAppBar = () => {

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { active, account, library, connector, activate, deactivate, chainId } = useWeb3React()

  const connectMetamask = async () => {
    try {
      await activate(createInjector("METAMASK"))
    } catch (error) {
      console.log(error);
    }
  }

  const switchNetwork = async () => {
    let { ethereum } = window
    if(ethereum) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          // await ethereum.request({
          //   method: 'wallet_addEthereumChain',
          //   params: [
          //     {
          //       chainId: '0x13881',
          //       nativeCurrency: {
          //         name: 'MATIC',
          //         symbol: 'MATIC',
          //         decimals: 18,
          //       },
          //       chainName: 'Polygon Testnet',
          //       rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          //       blockExplorerUrls: ['https://mumbai.polygonscan.com/']
          //     },
          //   ],
          // });
        } catch (addError) {
          console.log(addError)
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }

  }
}

  useEffect(()=>{
    connectMetamask()
    switchNetwork()
  }, [])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" style={{background: "#060826"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Gobble!
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, position: "absolute", top: 20, right: 10 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                textAlign: "right"
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, justifyContent: "flex-end", display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
        
              <button 
                onClick={connectMetamask} 
                style={{padding: 10, fontSize: 15, borderRadius: 30, fontWeight: "bold"}} 
                className='hide'
              > 
                  { !active ? 'connect' : `${account.substring(0, 10)}`}
              </button>
   
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
