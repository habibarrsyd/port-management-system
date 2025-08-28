import React, { useState, useEffect } from "react";
import { 
    AppBar, 
    Fade, 
    Menu, 
    MenuItem, 
    styled, 
    Toolbar, 
    Typography, 
    IconButton,
    Divider,
    ListItemIcon,
    Box
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from '../../image/logo.png';
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "var(--secondary-color)",
    boxShadow: "none",
    borderBottom: "0.7px solid var(--border-color)",
});

const StyledTypography = styled(Typography)({
    variant: "h6",
    fontWeight: 700,
    color: "var(--primary-font-color)",
    fontFamily: "poppins",
    display: "flex",
    alignItems: "center",
    marginRight: "auto",
});

const StyledIconButton = styled(IconButton)({
    color: "var(--primary-font-color)",
    '&:hover': {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    }
});

const StyledMenu = styled(Menu)({
    '& .MuiPaper-root': {
        backgroundColor: "var(--secondary-color)",
        border: "1px solid var(--border-color)",
        minWidth: 200,
        marginTop: 8,
    },
    '& .MuiMenuItem-root': {
        color: "var(--primary-font-color)",
        '&:hover': {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
        }
    }
});

const Navbar = ({ onMenuClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userInfo, setUserInfo] = useState({
        username: "Loading...",
        email: "Loading..."
    });
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setUserInfo(userDoc.data());
                    } else {
                        // Fallback to auth data if no Firestore document
                        setUserInfo({
                            username: user.displayName || "User",
                            email: user.email || "No email"
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserInfo({
                    username: "Guest",
                    email: "guest@example.com"
                });
            }
        };

        fetchUserData();
    }, []);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            handleClose();
            toast.success("Logged out successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleProfile = () => {
        // Add profile navigation logic here if you have a profile page
        handleClose();
        console.log("Opening profile...");
    };

    return (
        <AppBar position="relative">
            <StyledToolbar>
                <StyledIconButton onClick={onMenuClick}>
                    <MenuIcon />
                </StyledIconButton>
                
                <StyledTypography>
                    <img src={logo} alt="logo" width={55} height={35} />
                    FinBuddy
                </StyledTypography>

                <div>
                    <StyledIconButton
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{ cursor: 'pointer' }}
                    >
                        <AccountCircleIcon sx={{ fontSize: 30 }} />
                    </StyledIconButton>
                    
                    <StyledMenu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ px: 2, py: 1, color: "var(--primary-font-color)" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {userInfo?.username || "User"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                {userInfo?.email || "user@example.com"}
                            </Typography>
                        </Box>
                        <Divider sx={{ borderColor: "var(--border-color)" }} />
                        
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon sx={{ color: "var(--primary-font-color)" }} />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </StyledMenu>
                </div>
            </StyledToolbar>
        </AppBar>
    );
};

export default Navbar;