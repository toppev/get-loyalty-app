import 'dart:async';

import 'package:flutter/material.dart';
import 'errorDialog.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import 'services/scanService.dart';

// TODO: change
const MAX_SCAN_DURATION = Duration(seconds: 30);
const SCAN_COOLDOWN = 5000; // In millis

var lastScanned = 0;

class ScannerWidget extends StatefulWidget {
  final ValueChanged<GetScan> onScan;
  final ValueChanged<bool> onScanToggle;

  const ScannerWidget({
    Key key,
    this.onScan,
    this.onScanToggle,
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() => ScannerWidgetState();
}

class ScannerWidgetState extends State<ScannerWidget> {
  QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

  var scanService;

  Timer timer;

  @override
  Widget build(BuildContext context) {
    scanService = Provider.of<ScanService>(context);

    return Scaffold(
      body: QRView(
        key: qrKey,
        onQRViewCreated: _onQRViewCreated,
        overlay: QrScannerOverlayShape(
          borderColor: Colors.deepOrange,
          borderRadius: 10,
          borderLength: 30,
          borderWidth: 10,
          cutOutSize: 300,
        ),
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) async {
      if (!checkCooldown()) {
        print('Still on cooldown (scanned $scanData)');
      } else {
        var stateText = scanData;
        // The scanned code is userId:rewardId or just userId but be flexible so we can change it without updating the client
        if (scanData.length < 24 || scanData.length > 50) {
          stateText = "(INVALID) " + stateText;
        } else {
          setScanning(false);
          scanService.getScan(scanData, 'testBusiness123').then((result) {
            print('handling request result: $result');
            widget.onScan(result);
          }).catchError((e) {
            print(e);
            showError(context,
                message: "Please check connection", error: e.toString());
          });
        }
        print('Scanned $stateText');
      }
    });
  }

  void resetTimer() {
    print('Reset timer. Timer: ${timer == null}');
    timer?.cancel();
    timer = Timer(MAX_SCAN_DURATION, () {
      print('Pausing camera automatically');
      try {
        setScanning(false);
      } catch (e) {
        print('Failed to pause camera: $e');
      }
    });
  }

  void setScanning(bool scanning) {
    if (scanning) {
      resetTimer();
      controller.resumeCamera();
    } else {
      timer?.cancel();
      controller.pauseCamera();
    }
    widget.onScanToggle(scanning);
  }

  bool checkCooldown() {
    var now = new DateTime.now().millisecondsSinceEpoch;
    if (now - SCAN_COOLDOWN > lastScanned) {
      lastScanned = now;
      return true;
    }
    return false;
  }

  @override
  void initState() {
    resetTimer();
    super.initState();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
