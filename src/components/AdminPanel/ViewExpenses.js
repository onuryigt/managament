import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import axios from 'axios';

function ViewExpenses() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const handleDownload = (fileName) => {
        window.open(`http://localhost:3001/uploads/${fileName}`, '_blank');
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Harcama Raporları
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Yükleyen Müdür</TableCell>
                            <TableCell>Dosya Adı</TableCell>
                            <TableCell>Yükleme Tarihi</TableCell>
                            <TableCell>İndir</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell>{expense.manager_id}</TableCell>
                                <TableCell>{expense.file_name}</TableCell>
                                <TableCell>{expense.upload_date}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDownload(expense.file_name)}
                                    >
                                        İndir
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

export default ViewExpenses;