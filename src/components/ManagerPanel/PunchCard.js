import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select } from '@mui/material';
import axios from 'axios';

function PunchCard() {
    const [employees, setEmployees] = useState([]);
    const [punchCards, setPunchCards] = useState([]);
    const [employeeId, setEmployeeId] = useState('');
    const [date, setDate] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEmployees();
        fetchPunchCards();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchPunchCards = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/punch-cards');
            setPunchCards(response.data);
        } catch (error) {
            console.error('Error fetching punch cards:', error);
        }
    };

    const handleAddPunch = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/add-punch', {
                employeeId, date, hoursWorked
            });

            if (response.status === 200) {
                setMessage('Puantaj başarıyla eklendi.');
                setEmployeeId('');
                setDate('');
                setHoursWorked('');
                fetchPunchCards();
            } else {
                setMessage('Puantaj eklenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error adding punch card:', error);
            setMessage('Puantaj eklenirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Puantaj Yönetimi
            </Typography>
            <Box mb={3}>
                <Select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    displayEmpty
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="" disabled>
                        Eleman Seçin
                    </MenuItem>
                    {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                            {employee.name}
                        </MenuItem>
                    ))}
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
                    label="Çalışılan Saat"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Box textAlign="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleAddPunch}>
                        Puantaj Ekle
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
                            <TableCell>İsim</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>Çalışılan Saat</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {punchCards.map((punchCard) => (
                            <TableRow key={punchCard.id}>
                                <TableCell>{punchCard.name}</TableCell>
                                <TableCell>{punchCard.date}</TableCell>
                                <TableCell>{punchCard.hours_worked}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default PunchCard;