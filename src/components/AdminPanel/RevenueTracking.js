import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function RevenueTracking() {
    const [restaurant, setRestaurant] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [revenues, setRevenues] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRevenues();
    }, []);

    const fetchRevenues = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/revenues');
            setRevenues(response.data);
        } catch (error) {
            console.error('Error fetching revenues:', error);
        }
    };

    const handleAddRevenue = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/add-revenue', {
                restaurant, date, amount
            });

            if (response.status === 200) {
                setMessage('Ciro başarıyla eklendi.');
                setRestaurant('');
                setDate('');
                setAmount('');
                fetchRevenues();
            } else {
                setMessage('Ciro eklenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error adding revenue:', error);
            setMessage('Ciro eklenirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Ciro Takibi
            </Typography>
            <Box mb={3}>
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
                <TextField
                    label="Tarih"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Tutar"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Box textAlign="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleAddRevenue}>
                        Ciro Ekle
                    </Button>
                </Box>
            </Box>
            {message && (
                <Box textAlign="center" mt={2}>
                    <Typography variant="body1">{message}</Typography>
                </Box>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Restoran</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>Tutar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {revenues.map((revenue) => (
                            <TableRow key={revenue.id}>
                                <TableCell>{revenue.restaurant}</TableCell>
                                <TableCell>{revenue.date}</TableCell>
                                <TableCell>{revenue.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default RevenueTracking;