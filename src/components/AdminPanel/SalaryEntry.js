import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function SalaryEntry() {
    const [employees, setEmployees] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [employeeId, setEmployeeId] = useState('');
    const [month, setMonth] = useState('');
    const [salary, setSalary] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEmployees();
        fetchSalaries();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchSalaries = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/salaries');
            setSalaries(response.data);
        } catch (error) {
            console.error('Error fetching salaries:', error);
        }
    };

    const handleAddSalary = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/salary-entry', {
                employeeId, month, salary
            });

            if (response.status === 200) {
                setMessage('Maaş başarıyla eklendi.');
                setEmployeeId('');
                setMonth('');
                setSalary('');
                fetchSalaries();
            } else {
                setMessage('Maaş eklenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error adding salary:', error);
            setMessage('Maaş eklenirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Maaş Girişi ve Hesaplama
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
                    label="Ay"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Maaş"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Box textAlign="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleAddSalary}>
                        Maaş Ekle
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
                            <TableCell>Ay</TableCell>
                            <TableCell>Maaş</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salaries.map((salary) => (
                            <TableRow key={salary.id}>
                                <TableCell>{salary.name}</TableCell>
                                <TableCell>{salary.month}</TableCell>
                                <TableCell>{salary.salary}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default SalaryEntry;