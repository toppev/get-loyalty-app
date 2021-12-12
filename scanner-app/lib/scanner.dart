import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import 'error_dialog.dart';
import 'services/scan_service.dart';

const MAX_SCAN_DURATION = Duration(minutes: 3);
const SCAN_COOLDOWN = 2500; // In millis
const SCAN_COOLDOWN_SAME_STRING = 10000; // In millis

var lastScanned = 0;
String lastScannedString;

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

  ScanService scanService;

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
    controller.scannedDataStream.listen((barcode) async {
      final scanData = barcode.code;
      if (!checkCooldown(scanData)) {
        print('Still on cooldown (scanned $scanData)');
      } else {
        var stateText = scanData;
        // The scanned code is userId:rewardId or just userId but be flexible so we can change it without updating the client
        if (scanData.length < 24 || scanData.length > 100) {
          stateText = "INVALID QR code text: \"$stateText\". Not a loyalty QR code?";
        } else {
          setScanning(false);
          scanService.getScan(scanData).then((result) {
            print('Handling request result: ${result.toJson()}');
            widget.onScan(result);
          }).catchError((e) {
            print(e);
            showError(context, message: "Please check connection", error: e.toString());
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
      setScanning(false);
    });
  }

  void setScanning(bool scanning, {startCooldown}) {
    if (startCooldown == true) {
      lastScanned = new DateTime.now().millisecondsSinceEpoch;
    }

    if (scanning) {
      resetTimer();
      try {
        controller.resumeCamera();
      } catch (e, stacktrace) {
        print('Failed to resume camera ($e): $stacktrace');
      }
    } else {
      timer?.cancel();
      try {
        controller.pauseCamera();
      } catch (e, stacktrace) {
        print('Failed to resume camera ($e): $stacktrace');
      }
    }
    widget.onScanToggle(scanning);
  }

  bool checkCooldown(str) {
    final now = new DateTime.now().millisecondsSinceEpoch;
    if (now - SCAN_COOLDOWN > lastScanned && (now - SCAN_COOLDOWN_SAME_STRING > lastScanned || str != lastScannedString)) {
      lastScanned = now;
      lastScannedString = str;
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
