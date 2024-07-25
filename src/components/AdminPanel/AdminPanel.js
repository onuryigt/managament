import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const navigate = useNavigate();

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Yönetici Paneli
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/add-manager')}>
                    Müdür Ekle
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/add-employee')}>
                    Eleman Ekle
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/view-shifts')}>
                    Shift Görüntüle
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/view-punch-cards')}>
                    Puantaj
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/salary-entry')}>
                    Maaş Girişi ve Maaş Hesaplama
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/revenue-tracking')}>
                    Ciro Takibi
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/view-expenses')}>
                    Harcama Excel Dosyalarını Görüntüle
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/view-stock-counts')}>
                    Stok Sayımı Görüntüle
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/view-losses')}>
                    Zayileri Görüntüle
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/invoices')}>
                    Fatura Girişi ve Çıkışı Görüntüle
                </Button>
            </Box>
        </Container>
    );
}

export default AdminPanel;