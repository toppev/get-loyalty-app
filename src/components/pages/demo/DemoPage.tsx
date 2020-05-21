import { Box, Button, createStyles, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import QRCode from "qrcode.react";
import React from "react";
import CopyToClipboard from '../../common/CopyToClipboarad';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        typography: {
            color: theme.palette.grey[400]
        },
        box: {
            textAlign: 'center',
        },
        item: {
            padding: '10px',
            margin: '0px 20px'
        },
        linkItem: {
            marginTop: '50px',
            color: theme.palette.grey[100],
        },
        copyBtn: {
            marginLeft: '4px'
        },
    }));

export default function () {

    const classes = useStyles();

    const src = "https://www.google.com/";

    return (
        <Box display="flex" flexWrap="wrap" flexDirection="row" className={classes.box}>
            <Box className={classes.item}>
                <PreviewWebsite src={src}/>
            </Box>
            <Box className={classes.item}>
                <Typography className={classes.typography} variant="h5">
                    Scan the QR code or share the link to try on other devices
                </Typography>
                <p className={classes.typography}>
                    This is what you would see as an customer. Only published sites will display.
                    Edit pages <Link href='/pages' underline='always' color='inherit'>here</Link>
                </p>
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
            </Box>

        </Box>
    )
}

interface PreviewWebsiteProps {
    src: string
}

function PreviewWebsite(props: PreviewWebsiteProps) {

    return (
        <iframe title="Page Preview" src={props.src} height={640} width={360}/>
    )
}