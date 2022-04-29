import React, { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
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
  Grid,
  CardHeader,
  Box
} from '@mui/material';
import Chart from 'react-apexcharts';
import { NotificationManager } from 'react-notifications';
import { merge } from 'lodash';
import { alpha, styled } from '@mui/material/styles';
import axios from 'axios';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { PersonAddAlt, Report } from '@mui/icons-material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Scrollbar from '../components/Scrollbar';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BaseOptionChart } from '../components/charts';

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
  const [loading, setloading] = useState(false);
  const [seriesData, setSeriesData] = useState([
    {
      // name: 'Fake Followers',
      data: [0, 0, 0, 0]
    }
  ]);

  const getBotometerData = async () => {
    if (search) {
      setloading(true);
      const URL = `https://botometer.herokuapp.com/getUserBotometer?userName=${search}`;
      const response = await axios.get(URL);
      console.log('response ==> ', response);
      if (response?.data?.data) {
        setloading(false);
        setTweeterData(null);
        const responseData = response.data.data;
        setTweeterData(responseData);
        setSeriesData([
          {
            data: [
              Math.ceil(
                ((responseData?.followers_count || 0) *
                  (responseData?.userScoreData?.display_scores?.english?.fake_follower || 0)) /
                  5
              ),
              Math.ceil(
                ((responseData?.followers_count || 0) *
                  (responseData?.userScoreData?.display_scores?.english?.self_declared || 0)) /
                  5
              ),
              Math.ceil(
                ((responseData?.followers_count || 0) *
                  (responseData?.userScoreData?.display_scores?.english?.spammer || 0)) /
                  5
              ),
              Math.ceil(
                ((responseData?.followers_count || 0) *
                  (responseData?.userScoreData?.display_scores?.english?.overall || 0)) /
                  5
              )
            ]
          }
        ]);
      } else {
        setloading(false);
        NotificationManager.error(response?.data?.message);
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
    info,
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
      <div
        style={{
          marginLeft: '32px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Typography variant="h3">{cardTotalCount}</Typography>{' '}
        <Tooltip
          title={
            <p style={{ fontSize: '12px' }}>
              <p> Scroe ranges from 0-5</p>
              <p> Score near to 0 is low bot activity</p>
              <p> Score near to 5 is high bot activity</p>
            </p>
          }
          arrow
        >
          <IconButton>
            <Iconify icon="bi:info" width={24} height={24} />
          </IconButton>
        </Tooltip>{' '}
      </div>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {cardTitleName}
      </Typography>
      <div>
        <Tooltip title={<p style={{ fontSize: '14px' }}>{info}</p>} arrow>
          <Button style={{ color: rootColor }}>Info</Button>
        </Tooltip>
      </div>
    </Card>
  );

  const chartOptions = {
    options: {
      chart: {
        id: 'basic-line'
      },
      xaxis: {
        categories: [
          'Fake Followers Score',
          'Self Declared Score',
          'Spammer Score',
          'Overall Score'
        ]
      },
      fill: {
        colors: ['#349bf1'],
        opacity: 1,
        gradient: {
          type: 'vertical',
          shadeIntensity: 0,
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 100]
        }
      },
      plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
      stroke: {
        width: 3,
        curve: 'smooth',
        lineCap: 'round'
      }
    }
  };

  return (
    <Page title="Tweet-O-Bot">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'lightblue'
        }}
      >
        <h1> Tweet-O-bot</h1>
      </div>

      <Container style={{ paddingTop: '10px' }}>
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
          <Button
            variant="contained"
            onClick={() => {
              if (!search.length) {
                NotificationManager.error('Please enter user');
              } else {
                getBotometerData();
              }
            }}
          >
            Fetch Data
          </Button>
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer }} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Stack>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            lineHeight: '2rem'
          }}
        >
          <h1> About Tweet-O-Bot</h1>
          <p style={{ paddingTop: '2rem' }}>
            Tweet-O-Bot, as the name suggest this tool can be used to identify the bot activity for
            any given username on{' '}
            <a href="https://twitter.com/i/flow/login" style={{ textDecoration: 'none' }}>
              Twitter
            </a>
            . Here, you can find out recent activity of any given user such as,
            tweets,likes,followers,followings,retweets,date of the tweets to understand the user
            better. With all the given information, it will also show the possible fake followers,
            spammers, self declared bots and overall bot activity score by taking the reference from{' '}
            <a href="https://botometer.osome.iu.edu/" style={{ textDecoration: 'none' }}>
              Botometer
            </a>{' '}
            . Here we are trying to make sense of the score from botometer, by giving the
            number(approx) of bot accounts by the graphical representation.
          </p>
        </div>
        <Grid container spacing={3} paddingBottom="1rem">
          <Grid item xs={12} sm={6} md={3}>
            {renderCardDetails(
              '#005249',
              '#C8FACD',
              '#007B55',
              'rgba(0, 123, 85, 0)',
              'rgba(0, 123, 85, 0.24)',
              'Fake Followers Score',
              'Fake follower score is the bots purchased to increase follower counts.',
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
              'Self Declared Score',
              'Self declared score is the bots from botwiki.org.',
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
              'Spammer Score',
              'Spammer score is the accounts labeled as spambots from several datasets',
              tweeterData?.userScoreData?.display_scores?.english?.spammer || '0',
              'ant-design:warning-outlined'
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderCardDetails(
              '#fff',
              '#E32227',
              '#fff',
              'rgba(183, 33, 54, 0)',
              'rgba(183, 33, 54, 0.24)',
              'Overall Score',
              'Overall score is based on a comparison of several models trained on different kinds of bots and on human accounts.',
              tweeterData?.userScoreData?.display_scores?.english?.overall || '0',
              'ant-design:file-text-outlined'
            )}
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title="Overall   " />
              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <Chart
                  type="area"
                  series={seriesData}
                  options={chartOptions.options}
                  height={364}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <Scrollbar>
            <TableContainer component={Paper}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1> Recent Tweets</h1>
              </div>
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            lineHeight: '2rem'
          }}
        >
          <h1> Future Work</h1>
          <p style={{ paddingTop: '2rem' }}>
            UI can be enhanced using additional UI controls. In search section, instead of only
            usernames, hashtags can also be checked for bot activity. User login can be included, to
            keep the record of the user activity by their user id of twitter. More information can
            be displayed such as, more graphs, statistics , area wise hotspots etc. We can also add
            more API’s of different bot detection tools on this dashboard to make it one place for
            all the information regarding bot activity of any kind. By adding more API’s we can also
            compare the results from different tools at one place and can also make the more clearer
            picture of the scenario.
          </p>
        </div>
      </Container>
    </Page>
  );
}

export default TweeterAnalysis;
