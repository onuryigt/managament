import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import axios from 'axios';

function ViewStockCounts() {
    const [stockReports, setStockReports] = useState([]);

    useEffect(() => {
        fetchStockReports();
    }, []);

    const fetchStockReports = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/stock-reports');
            setStockReports(response.data);
        } catch (error) {
            console.error('Error fetching stock reports:', error);
        }
    };

    const handleDownload = (fileName) => {
        window.open(`http://localhost:3001/uploads/${fileName}`, '_blank');
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Stok Sayım Raporları
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
                        {stockReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.manager_id}</TableCell>
                                <TableCell>{report.file_name}</TableCell>
                                <TableCell>{report.upload_date}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDownload(report.file_name)}
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

export default ViewStockCounts;