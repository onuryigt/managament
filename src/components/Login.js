import React, { useState } from 'react';
import { Container, TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pizzaLogo from '../assets/pizza_locale.png';
import dirtyLogo from '../assets/dirty_five.png';
import kpLogo from '../assets/karaali_pidecisi.png';
import justLogo from '../assets/just_logo.png';

const Background = styled('div')({
    background: 'linear-gradient(to bottom, #000000, #434343)',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
});

const LoginBox = styled(Box)({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '30px',
    textAlign: 'center',
    width: '300px',
});

const Logo = styled('img')({
    width: '100px',
    margin: '20px',
});

const JustLogo = styled('img')({
    width: '50px',
    position: 'absolute',
    bottom: '20px',
    right: '20px',
});

const StyledButton = styled(Button)({
    backgroundColor: '#007BFF',
    color: '#fff',
    marginTop: '20px',
    '&:hover': {
        backgroundColor: '#0056b3',
    },
    borderRadius: '20px',
});

function Login() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://managament-nz32.vercel.app/login', { password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/manager');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Giriş başarısız. Şifrenizi kontrol edin.');
        }
    };

    return (
        <Background>
            <LoginBox>
                <TextField
                    label="Şifre"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputLabelProps={{
                        style: { color: '#fff' },
                    }}
                    InputProps={{
                        style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '20px' },
                    }}
                />
                <StyledButton variant="contained" fullWidth onClick={handleLogin}>
                    Giriş
                </StyledButton>
            </LoginBox>
            <Box display="flex" justifyContent="center" mt={2}>
                <Logo src={pizzaLogo} alt="Pizza Locale" />
                <Logo src={dirtyLogo} alt="Dirty Five" />
                <Logo src={kpLogo} alt="Karaali Pidecisi" />
            </Box>
            <JustLogo src={justLogo} alt="Just Logo" />
        </Background>
    );
}

export default Login;