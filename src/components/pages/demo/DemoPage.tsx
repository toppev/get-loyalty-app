import { Box, Button, createStyles, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import QRCode from "qrcode.react";
import React from "react";
import CopyToClipboard from '../../common/CopyToClipboarad';
import { APP_URL, BUSINESS_ID } from "../../../config/axios";
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
            fontSize: '14px'
        },
        editLink: {
            color: theme.palette.info.light,
        },
        boxDesktop: {
            textAlign: 'center',
        },
        item: {
            padding: '10px',
            margin: '0px 20px'
        },
        qrCodeStuff: {},
        linkItem: {
            marginTop: '50px',
            color: theme.palette.grey[100],
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

    // TODO: FIXME: find a solution for demo (page preview) page
    const src = `${APP_URL}/?business=${BUSINESS_ID}`;

    return (
        <Box display="flex" flexWrap="wrap" flexDirection="row" alignItems="center" className={classes.boxDesktop}>
            <Box className={classes.item}>
                <PreviewIframe src={src} className={classes.pagePreview}/>
            </Box>
            <Box className={classes.item}>
                <div className={classes.qrCodeStuff}>
                    <Typography className={classes.typography} variant="h5">
                        Scan the QR code or share the link to try on other devices
                    </Typography>
                    <Typography className={classes.secondTypography} variant="h6">
                        This is what you would see as an customer. Only published sites will display.
                    </Typography>
                    <p className={classes.editLink}> Edit pages <Link href='/pages' underline='always'
                                                                      color='inherit'>here</Link></p>
                    <div className={classes.linkItem}>
                        <QRCode value={src}/>
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
            </Box>

        </Box>
    )
}