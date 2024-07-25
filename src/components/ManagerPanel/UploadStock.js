import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import axios from 'axios';

function UploadStock() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            setMessage('Lütfen bir dosya seçin.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('managerId', 1); // Bu ID, oturum açan müdürün ID'si olmalı

        try {
            const response = await axios.post('http://localhost:3001/api/upload-stock', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setMessage('Rapor başarıyla yüklendi.');
                setFile(null);
            } else {
                setMessage('Rapor yüklenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('There was an error!', error);
            setMessage('Rapor yüklenirken bir hata oluştu.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Stok Sayım Raporu Yükle
            </Typography>
            <input
                accept=".xls,.xlsx,.csv,.pdf"
                style={{ display: 'none' }}
                id="upload-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="upload-file">
                <Button variant="contained" color="primary" component="span">
                    Dosya Seç
                </Button>
            </label>
            <Box textAlign="center" mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Raporu Yükle
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

export default UploadStock;