import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HistoryIcon from '@mui/icons-material/History';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ExchangeOption = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: 12,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const Change = () => {
  const theme = useTheme();
  const [points, setPoints] = useState(1000);
  const [exchangeType, setExchangeType] = useState('voucher');
  const [amount, setAmount] = useState('');
  const [exchangeHistory] = useState([
    { id: 1, type: 'voucher', amount: 500, date: '2024-03-15', status: 'completed' },
    { id: 2, type: 'coin', amount: 200, date: '2024-03-10', status: 'completed' },
  ]);

  const handleExchange = () => {
    // Handle exchange logic here
    //console.log('Exchanging points:', { type: exchangeType, amount });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Đổi Điểm Tích Lũy
        </Typography>

        {/* Points Balance Card */}
        <StyledCard sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Số điểm hiện có
              </Typography>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {points.toLocaleString()} điểm
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>

        {/* Exchange Options */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <ExchangeOption
              onClick={() => setExchangeType('voucher')}
              sx={{
                bgcolor: exchangeType === 'voucher' ? 'primary.main' : 'background.paper',
                color: exchangeType === 'voucher' ? 'primary.contrastText' : 'text.primary',
              }}
            >
              <CardGiftcardIcon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6">Đổi Voucher</Typography>
              <Typography variant="body2">1 điểm = 1.000đ voucher</Typography>
            </ExchangeOption>
          </Grid>
          <Grid item xs={12} md={6}>
            <ExchangeOption
              onClick={() => setExchangeType('coin')}
              sx={{
                bgcolor: exchangeType === 'coin' ? 'primary.main' : 'background.paper',
                color: exchangeType === 'coin' ? 'primary.contrastText' : 'text.primary',
              }}
            >
              <MonetizationOnIcon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6">Đổi Xu</Typography>
              <Typography variant="body2">1 điểm = 100 xu</Typography>
            </ExchangeOption>
          </Grid>
        </Grid>

        {/* Exchange Form */}
        <StyledCard sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thực hiện đổi điểm
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Loại đổi</InputLabel>
                  <Select
                    value={exchangeType}
                    label="Loại đổi"
                    onChange={(e) => setExchangeType(e.target.value)}
                  >
                    <MenuItem value="voucher">Voucher</MenuItem>
                    <MenuItem value="coin">Xu</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điểm muốn đổi"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    endAdornment: <Typography variant="body2">điểm</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleExchange}
                  disabled={!amount || amount > points}
                >
                  Xác nhận đổi điểm
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        {/* Exchange History */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Lịch sử đổi điểm</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {exchangeHistory.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {item.type === 'voucher' ? 'Đổi Voucher' : 'Đổi Xu'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.date}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" color="primary">
                      {item.amount} điểm
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: item.status === 'completed' ? 'success.main' : 'warning.main',
                      }}
                    >
                      {item.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </StyledCard>
      </motion.div>
    </Container>
  );
};

export default Change;
