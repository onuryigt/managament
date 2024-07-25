import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import axios from 'axios';

function AddEmployee() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [message, setMessage] = useState('');

    const handleAddEmployee = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/add-employee', {
                name, phone, role, hourlyRate
            });

            if (response.status === 200) {
                setMessage('Eleman başarıyla eklendi.');
                setName('');
                setPhone('');
                setRole('');
                setHourlyRate('');
            } else {
                setMessage('Eleman eklenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            setMessage('Eleman eklenirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Eleman Ekle
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
                    label="Telefon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Görev"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Saatlik Ücret"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Box textAlign="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleAddEmployee}>
                        Eleman Ekle
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

export default AddEmployee;