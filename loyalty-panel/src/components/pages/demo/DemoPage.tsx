import { Box, Button, createStyles, Link, makeStyles, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import QRCode from "qrcode.react";
import React from "react";
import CopyToClipboard from '../../common/CopyToClipboarad';
import { backendURL } from "../../../config/axios";
import PreviewIframe from "../../common/PreviewIframe";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      color: theme.palette.grey[400],
      fontSize: '22px',
      margin: '10px 0px'
    },
    secondTypography: {
      color: theme.palette.grey[500],
      fontSize: '14px',
      maxWidth: '600px'
    },
    editLink: {
      color: theme.palette.info.light,
    },
    boxDesktop: {
      textAlign: 'center',
    },
    item: {
      padding: '10px',
      margin: '0px 15px'
    },
    qrCodeStuff: {},
    linkItem: {
      marginTop: '50px',
      color: theme.palette.grey[100],
    },
    qrCode: {
      backgroundColor: 'white',
      padding: '10px',
      paddingBottom: '5px', // wtf?
      margin: 'auto',
      width: 'fit-content'
    },
    copyBtn: {
      marginLeft: '4px'
    },
    pagePreview: {
      border: 'solid 30px #1d1d1d',
      borderLeftWidth: '15px',
      borderRightWidth: '15px',
      borderRadius: '20px'
    }
  }));

export default function () {

  const classes = useStyles();
  const notMobile = useMediaQuery(useTheme().breakpoints.up('sm'));

  // FIXME: should we iframe the self hosted page or??
  // Probably good enough for now
  const src = process.env.NODE_ENV === "development" ? "http://localhost:3000" : `${backendURL}`.replace('/api', '');

  return (
    <Box display="flex" flexWrap="wrap" flexDirection="row" alignItems="center" className={classes.boxDesktop}>
      <Box className={classes.item}>
        {notMobile ? <PreviewIframe src={src} className={classes.pagePreview}/> :
          <div>
            <h2 style={{ color: 'white', margin: '50px 0px 120px 0px' }}>You can view the demo page <Link
              href={src} target="_blank" rel="noopener"><u>here</u></Link>.
            </h2>
          </div>
        }
      </Box>
      <Box className={classes.item}>
        <div className={classes.qrCodeStuff}>
          <Typography className={classes.typography} variant="h5">
            Scan the QR code or share the link to try on other devices
          </Typography>
          <Typography className={classes.secondTypography} variant="h6">
            This is what you would see as a customer. Only published sites will be displayed. Some features
            (for example, enabling push notifications) do not work in this embedded demo. Open the link on
            your phone for better experience.
          </Typography>
          <p className={classes.editLink}>
            Edit pages <Link href='/pages' underline='always' color='inherit'>here</Link>
          </p>
          <div className={classes.linkItem}>
            <div className={classes.qrCode}>
              <QRCode value={src}/>
            </div>
          </div>
          <div className={classes.linkItem}>
            <Link href={src} color="inherit" target="_blank" rel="noopener"><u>{src}</u></Link>
            <span className={classes.copyBtn}>
                    <CopyToClipboard>
                        {({ copy }) => (
                          <Button
                            size="small"
                            color="secondary"
                            onClick={() => copy(src)}
                            endIcon={<LinkIcon/>}
                          >Copy</Button>
                        )}
                    </CopyToClipboard>
                    </span>
          </div>
        </div>
        <p>The app is not working? Restart it on the <Link href='/settings'>settings page</Link>.</p>
      </Box>

    </Box>
  )
}
