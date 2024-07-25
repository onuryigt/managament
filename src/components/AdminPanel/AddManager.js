import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Select, MenuItem } from '@mui/material';
import axios from 'axios';

function AddManager() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [restaurant, setRestaurant] = useState('');
    const [message, setMessage] = useState('');

    const handleAddManager = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/add-manager', {
                name, email, password, restaurant
            });

            if (response.status === 200) {
                setMessage('Müdür başarıyla eklendi.');
                setName('');
                setEmail('');
                setPassword('');
                setRestaurant('');
            } else {
                setMessage('Müdür eklenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error adding manager:', error);
            setMessage('Müdür eklenirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Müdür Ekle
            </Typography>
            <Box mb={3}>
                <TextField
                    label="İsim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Şifre"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Select
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    displayEmpty
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="" disabled>
                        Restoran Seçin
                    </MenuItem>
                    <MenuItem value="Karaali Pidecisi">Karaali Pidecisi</MenuItem>
                    <MenuItem value="Pizza Locale">Pizza Locale</MenuItem>
                    <MenuItem value="Dirty Five">Dirty Five</MenuItem>
                </Select>
                <Box textAlign="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleAddManager}>
                        Müdür Ekle
                    </Button>
                </Box>
            </Box>
            {message && (
                <Box textAlign="center" mt={2}>
                    <Typography variant="body1">{message}</Typography>
                </Box>
            )}
        </Container>
    );
}

export default AddManager;