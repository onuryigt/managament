import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select } from '@mui/material';
import axios from 'axios';

function ShiftSchedule() {
    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [employeeId, setEmployeeId] = useState('');
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEmployees();
        fetchShifts();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchShifts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/shifts');
            setShifts(response.data);
        } catch (error) {
            console.error('Error fetching shifts:', error);
        }
    };

    const handleAddShift = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/add-shift', {
                employeeId, day, startTime, endTime
            });

            if (response.status === 200) {
                setMessage('Shift başarıyla eklendi.');
                setEmployeeId('');
                setDay('');
                setStartTime('');
                setEndTime('');
                fetchShifts();
            } else {
                setMessage('Shift eklenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error adding shift:', error);
            setMessage('Shift eklenirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Shift Yönetimi
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
                    label="Gün"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Başlangıç Saati"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Bitiş Saati"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Box textAlign="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleAddShift}>
                        Shift Ekle
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
                            <TableCell>Gün</TableCell>
                            <TableCell>Başlangıç Saati</TableCell>
                            <TableCell>Bitiş Saati</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shifts.map((shift) => (
                            <TableRow key={shift.id}>
                                <TableCell>{shift.name}</TableCell>
                                <TableCell>{shift.day}</TableCell>
                                <TableCell>{shift.start_time}</TableCell>
                                <TableCell>{shift.end_time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default ShiftSchedule;