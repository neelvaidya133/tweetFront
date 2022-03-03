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
  tableCellClasses
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { format } from 'date-fns';
import Scrollbar from '../components/Scrollbar';
import Page from '../components/Page';

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

function TweeterAnalysis() {
  const [tweeterData, setTweeterData] = useState(null);

  useEffect(async () => {
    const URL = `http://localhost:3000/getUserDataByName`;
    await axios
      .get(URL)
      .then((res) => {
        console.log('Response From API ==> ', res);
        setTweeterData(res.data);
      })
      .catch((err) => {
        console.log('Error From API ==> ', err);
      });
  }, []);
  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Twitter Analysis
          </Typography>
        </Stack>
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
