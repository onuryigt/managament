import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

function EndOfDay() {
    const [report, setReport] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/end-of-day', {
                managerId: 1, // Bu ID, oturum açan müdürün ID'si olmalı
                report: report
            });

            if (response.status === 200) {
                setMessage('Rapor başarıyla kaydedildi.');
                setReport('');
            } else {
                setMessage('Rapor kaydedilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('There was an error!', error);
            setMessage('Rapor kaydedilirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Gün Sonu Raporu
            </Typography>
            <TextField
                label="Rapor"
                multiline
                rows={4}
                fullWidth
                value={report}
                onChange={(e) => setReport(e.target.value)}
                margin="normal"
                variant="outlined"
            />
            <Box textAlign="center" mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Raporu Kaydet
                </Button>
            </Box>
            {message && (
                <Box textAlign="center" mt={2}>
                    <Typography variant="body1">{message}</Typography>
                </Box>
            )}
        </Container>
    );
}

export default EndOfDay;