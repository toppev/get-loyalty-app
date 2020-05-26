import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'errorDialog.dart';
import 'questionDialog.dart';
import 'package:provider/provider.dart';

import 'scanner.dart';
import 'services/scanService.dart';

const PAUSED = "Start Scanning";
const SCANNING = "Stop Scanning";

class ScannerPage extends StatefulWidget {
  const ScannerPage({
    Key key,
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() => _ScannerPageState();
}

class _ScannerPageState extends State<ScannerPage> {
  GlobalKey<ScannerWidgetState> globalKey = GlobalKey();
  var isScanning = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: <Widget>[
          Expanded(
            child: Transform.scale(
                scale: 0.7,
                child: ScannerWidget(
                  key: globalKey,
                  onScan: _onScanGet,
                  onScanToggle: _updateToggleButton,
                )),
            flex: 1,
          ),
          Expanded(
            child: FittedBox(
              fit: BoxFit.contain,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Container(
                        margin: EdgeInsets.all(8.0),
                        child: RaisedButton(
                          onPressed: () {
                            var newState = !isScanning;
                            setState(() {
                              isScanning = newState;
                            });
                            globalKey.currentState.setScanning(newState);
                            print('Camera state changed: $newState');
                          },
                          child: Text(isScanning ? SCANNING : PAUSED,
                              style: TextStyle(fontSize: 20)),
                          color: isScanning ? Colors.redAccent : Colors.green,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Container(
                        margin: EdgeInsets.all(8.0),
                        child: RaisedButton(
                          onPressed: () {},
                          child: Text('unused button',
                              style: TextStyle(fontSize: 20)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            flex: 1,
          )
        ],
      ),
    );
  }

  void _updateToggleButton(bool scanning) {
    setState(() {
      isScanning = scanning;
    });
  }

  void _onScanGet(GetScan data) {
    var scanService = Provider.of<ScanService>(context);
    print('Scan get result: $data');
    showDialog(
      context: context,
      builder: (BuildContext context) => QuestionDialogWidget(
          onSubmit: (res) {
            print('Answers: $res');
            scanService
                .useScan(data.scannedString, 'fakebusiness', res)
                .then((result) {
              print('Scan used. Response: $result');
              globalKey.currentState.setScanning(true);
            }).catchError((e) {
              print(e);
              showError(context,
                  message: "Please check connection", error: e.toString());
            });
          },
          questions: data.questions),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}
