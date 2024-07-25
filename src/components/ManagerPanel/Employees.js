import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

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
                fetchEmployees();
            } else {
                setMessage('Eleman eklenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            setMessage('Eleman eklenirken bir hata oluştu.');
        }
    };

    const handleUpdateEmployee = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3001/api/update-employee/${id}`, {
                name, phone, role, hourlyRate
            });

            if (response.status === 200) {
                setMessage('Eleman başarıyla güncellendi.');
                fetchEmployees();
            } else {
                setMessage('Eleman güncellenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            setMessage('Eleman güncellenirken bir hata oluştu.');
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/delete-employee/${id}`);

            if (response.status === 200) {
                setMessage('Eleman başarıyla silindi.');
                fetchEmployees();
            } else {
                setMessage('Eleman silinirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            setMessage('Eleman silinirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Eleman Yönetimi
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>İsim</TableCell>
                            <TableCell>Telefon</TableCell>
                            <TableCell>Görev</TableCell>
                            <TableCell>Saatlik Ücret</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>{employee.role}</TableCell>
                                <TableCell>{employee.hourly_rate}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setName(employee.name);
                                            setPhone(employee.phone);
                                            setRole(employee.role);
                                            setHourlyRate(employee.hourly_rate);
                                            handleUpdateEmployee(employee.id);
                                        }}
                                    >
                                        Güncelle
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteEmployee(employee.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Sil
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default Employees;