import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Paper,
  Card,
  Stack,
  tableCellClasses,
  InputAdornment,
  OutlinedInput,
  Button,
  Grid
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import axios from 'axios';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { PersonAddAlt, Report } from '@mui/icons-material';
import Scrollbar from '../components/Scrollbar';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import {
  AppBugReports,
  AppItemOrders,
  AppNewUsers,
  AppWeeklySales
} from '../sections/@dashboard/app';
import { fShortenNumber } from '../utils/formatNumber';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 240, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

function TweeterAnalysis() {
  const [tweeterData, setTweeterData] = useState(null);
  const [search, setSearch] = useState('');

  // useEffect(async () => {
  //   if (search) {
  //     const URL = `http://localhost:5000/getUserBotometer?userName=${search}`;
  //     await axios
  //       .get(URL)
  //       .then((res) => {
  //         console.log('Response From API ==> ', res);
  //         // setTweeterData(res.data);
  //       })
  //       .catch((err) => {
  //         console.log('Error From API ==> ', err);
  //       });
  //   }
  // }, [search]);

  const getBotometerData = async () => {
    if (search) {
      const URL = `http://localhost:5000/getUserBotometer?userName=${search}`;
      const response = await axios.get(URL);

      if (response?.data) {
        setTweeterData(response.data);
      }
    }
  };

  const renderCardDetails = (
    rootColor,
    rootBgColor,
    iconWrapperColor,
    divRGBA1,
    divRGBA2,
    cardTitleName,
    cardTotalCount,
    Icon
  ) => (
    <Card
      style={{
        boxShadow: 'none',
        textAlign: 'center',
        padding: '40px 0px',
        color: rootColor,
        backgroundColor: rootBgColor
      }}
    >
      <div
        style={{
          margin: 'auto',
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          width: '4rem',
          height: '4rem',
          justifyContent: 'center',
          marginBottom: '3px',
          color: iconWrapperColor,
          backgroundImage: `linear-gradient(135deg, ${divRGBA1} 0%, ${divRGBA2} 100%)`
        }}
      >
        <Iconify icon={Icon} width={24} height={24} />
      </div>
      <Typography variant="h3">{cardTotalCount}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {cardTitleName}
      </Typography>
    </Card>
  );

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Twitter Analysis
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <SearchStyle
            value={search}
            placeholder="Search user..."
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
          <Button variant="contained" onClick={() => getBotometerData()}>
            Fetch Data
          </Button>
        </Stack>
        {/* <Stack direction="row" alignItems="flex-end" justifyContent="flex-end" marginBottom="2rem"> */}
        {/*  hiiii */}
        {/* </Stack> */}

        <Grid container spacing={3} paddingBottom="1rem">
          <Grid item xs={12} sm={6} md={3}>
            {renderCardDetails(
              '#005249',
              '#C8FACD',
              '#007B55',
              'rgba(0, 123, 85, 0)',
              'rgba(0, 123, 85, 0.24)',
              'Fake Followers Ratio',
              tweeterData?.userScoreData?.display_scores?.english?.fake_follower || '0',
              'ant-design:usergroup-add-outlined'
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderCardDetails(
              '#04297A',
              '#D0F2FF',
              '#0C53B7',
              'rgba(12, 83, 183, 0)',
              'rgba(12, 83, 183, 0.24)',
              'Self Declared Ratio',
              tweeterData?.userScoreData?.display_scores?.english?.self_declared || '0',
              'ant-design:user-add-outlined'
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderCardDetails(
              '#7A4F01',
              '#FFF7CD',
              '#B78103',
              'rgba(183, 129, 3, 0)',
              'rgba(183, 129, 3, 0.24)',
              'Spammer Ratio',
              tweeterData?.userScoreData?.display_scores?.english?.spammer || '0',
              'ant-design:warning-outlined'
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderCardDetails(
              '#7A0C2E',
              '#FFE7D9',
              '#B72136',
              'rgba(183, 33, 54, 0)',
              'rgba(183, 33, 54, 0.24)',
              'Overall Ratio',
              tweeterData?.userScoreData?.display_scores?.english?.overall || '0',
              'ant-design:file-text-outlined'
            )}
          </Grid>
        </Grid>

        <Card>
          <Scrollbar>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Followers</StyledTableCell>
                    <StyledTableCell align="right">Following</StyledTableCell>
                    <StyledTableCell align="right">Tweet Name</StyledTableCell>
                    <StyledTableCell align="right">Likes</StyledTableCell>
                    <StyledTableCell align="right">Total Reply</StyledTableCell>
                    <StyledTableCell align="right">Total Re-Tweet</StyledTableCell>
                    <StyledTableCell align="right">Created Date</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {tweeterData?.tweetData.map((row) => (
                    <StyledTableRow
                      key={tweeterData.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {tweeterData.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">{tweeterData.followers_count}</StyledTableCell>
                      <StyledTableCell align="left">{tweeterData.following_count}</StyledTableCell>
                      <StyledTableCell align="left">{row.text}</StyledTableCell>
                      <StyledTableCell align="left">
                        {row.public_metrics.like_count}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.public_metrics.reply_count}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.public_metrics.retweet_count}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {format(new Date(row.created_at), 'yyyy-MM-d')}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}

export default TweeterAnalysis;
