import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function ViewPunchCards() {
    const [punchCards, setPunchCards] = useState([]);

    useEffect(() => {
        fetchPunchCards();
    }, []);

    const fetchPunchCards = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/punch-cards');
            setPunchCards(response.data);
        } catch (error) {
            console.error('Error fetching punch cards:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Puantaj Bilgileri
            </Typography>
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

export default ViewPunchCards;