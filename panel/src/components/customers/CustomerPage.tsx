import React, { useCallback, useEffect, useState } from "react"
import {
  Box,
  Button,
  Collapse,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Theme,
} from "@mui/material"
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Customer from "./Customer"
import RetryButton from "../common/button/RetryButton"
import SearchField from "../common/SearchField"
import { listCustomers, rewardAllCustomers } from "../../services/customerService"
import useRequest from "../../hooks/useRequest"
import useSearch from "../../hooks/useSearch"
import useResponseState from "../../hooks/useResponseState"
import { Link } from "react-router-dom"
import RewardSelector from "../rewards/RewardSelector"
import IdText from "../common/IdText"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CustomerDetails from "./CustomerDetails"
import { debounce } from "lodash"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    p: {
      color: theme.palette.grey[600]
    },
    tools: {
      marginBottom: '25px',
    },
    actionBtn: {
      backgroundColor: theme.palette.grey[400],
      margin: '0px 12px',
      right: '15px'
    },
    boxDesktop: {
      textAlign: 'center',
      margin: '5px 15px',
      padding: '5px 15px'
    },
    head: {
      backgroundColor: '#c9d2d4'
    },
    root: {
      backgroundColor: 'ghostwhite',
      '& > *': {
        borderBottom: 'unset',
      }
    }
  }))


export default function CustomerPage() {

  const classes = useStyles()
  // How many customers to render
  const renderLimit = 50

  const { search, setSearch } = useSearch()
  const [orderBy, setOrderBy] = useState("-lastVisit")
  const { error, loading, response, performRequest } = useRequest()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const execSearch = useCallback(debounce((searchStr?: string, sort?: string) => {
    performRequest(() => listCustomers(searchStr, renderLimit, sort))
  }, 500, { leading: true }), [])

  useEffect(() => execSearch(search, orderBy), [execSearch, search, orderBy])

  const [customers] = useResponseState<Customer[]>(response, [], (res) => {
    return res.data.customers?.map((it: any) => new Customer(it)) || []
  })
  const [rewardAllSelector, setRewardAllSelector] = useState(false)

  return error ? (
    <RetryButton error={error}/>
  ) : (
    <div>
      <Box display="flex" className={classes.tools}>
        <Button
          className={classes.actionBtn}
          component={Link}
          to="/notifications"
          variant="contained"
        >Send Notification</Button>
        <Button
          className={classes.actionBtn}
          variant="contained"
          onClick={() => setRewardAllSelector(true)}
        >Reward All</Button>
      </Box>
      <SearchField
        setSearch={setSearch}
        name={"customer_search"}
      />
      <RewardSelector
        onClose={() => setRewardAllSelector(false)}
        open={rewardAllSelector}
        onSelect={(reward) => {
          if (window.confirm('You are about to reward EVERYONE.' +
            '\nThis action is irreversible.' +
            '\nClick OK to confirm rewarding all customers.')) {
            setRewardAllSelector(false)
            performRequest(
              () => rewardAllCustomers(reward),
              () => performRequest(() => listCustomers(search, renderLimit, orderBy))
            )
          }
        }}
      />
      <p className={classes.p}>Showing up to {renderLimit} customers at once</p>
      {loading && <LinearProgress/>}

      <TableContainer>
        <Table>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell>Expand</TableCell>
              <SortableCell label="Email" orderId="email" orderBy={orderBy} setOrderBy={setOrderBy}/>
              <TableCell>Rewards</TableCell>
              <SortableCell label="Points" orderId="customerData.properties.points" orderBy={orderBy} setOrderBy={setOrderBy}/>
              <SortableCell label="Last app visit" orderId="lastVisit" orderBy={orderBy} setOrderBy={setOrderBy}/>
              <SortableCell label="Role" orderId="role" orderBy={orderBy} setOrderBy={setOrderBy}/>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.slice(0, renderLimit).map(customer => (
              <CustomerRow
                key={customer.id}
                customer={customer}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  )
}

function SortableCell({ label, orderId, orderBy, setOrderBy }: any) {

  const orderActive = orderId === orderBy || `-${orderId}` === orderBy
  const isDesc = orderBy[0] === '-'

  return (
    <TableCell>
      <TableSortLabel
        active={orderActive}
        direction={isDesc ? 'desc' : 'asc'}
        onClick={() => setOrderBy(isDesc ? orderId : `-${orderId}`)}
      >
        {label}
        {orderBy === orderId ? (
          <Box component="span"/>
        ) : null}
      </TableSortLabel>
    </TableCell>
  )
}

interface CustomerRowProps {
  customer: Customer
}

function CustomerRow(props: CustomerRowProps) {

  const { customer } = props
  const { role } = customer
  const { rewards, properties } = customer.customerData

  const classes = useStyles()

  const [viewing, setViewing] = useState(false)

  return <>
    <TableRow className={classes.root}>
      <TableCell>
        <IconButton onClick={() => setViewing(!viewing)} size="large">{viewing ? <KeyboardArrowUpIcon/> :
          <KeyboardArrowDownIcon/>}</IconButton>
      </TableCell>
      <TableCell>
        {customer.email}
      </TableCell>
      <TableCell>
        {rewards.length} rewards
      </TableCell>
      <TableCell>
        {properties.points} points
      </TableCell>
      <TableCell>
        {customer.lastVisit?.toLocaleString()}
      </TableCell>
      <TableCell>
        { /* Might change the default role from user to customer later */}
        {role !== 'user' && role !== 'customer' ? role : ""}
      </TableCell>
      <TableCell>
        <IdText id={customer.id} text={false}/>
      </TableCell>
    </TableRow>
    <TableRow className={classes.root}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Collapse in={viewing} timeout="auto" unmountOnExit>
          <div className={classes.root}>
            <CustomerDetails initialCustomer={customer}/>
          </div>
        </Collapse>
      </TableCell>
    </TableRow>
  </>
}


