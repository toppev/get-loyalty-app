import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'error_dialog.dart';
import 'menu.dart';
import 'question_dialog.dart';
import 'scanner.dart';
import 'services/scan_service.dart';

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
      appBar: new AppBar(
        title: new Text('Scanner'),
        actions: <Widget>[MenuWidget()],
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: Transform.scale(
                scale: 0.8,
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
    var scanService = Provider.of<ScanService>(context, listen: false);
    print('Scan get result: $data');
    showDialog(
      context: context,
      builder: (BuildContext context) => QuestionDialogWidget(
          onSubmit: (res) {
            print('Answers: ${res.map((e) => e.toJson())}');
            scanService.useScan(data.scannedString, res).then((result) {
              print('Scan used. Response: ${result.toJson()}');
              _onScanSubmitted(result);
            }).catchError((e) {
              print(e);
              showError(context,
                  message: "Please check connection", error: e.toString());
            });
          },
          questions: data.questions),
    );
  }

  _onScanSubmitted(UseScan result) {
    if (result.usedReward != null) {
      var reward = result.usedReward;
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
                title: Text("Customer used reward: ${reward['name']}"),
                content: Column(
                  children: <Widget>[
                    Text("Name: ${reward['name']}"),
                    Text("Discount: ${reward['description']}"),
                    reward['requirement'] != null
                        ? Text("Note: ${reward['requirement']}")
                        : null,
                    Text(reward['description']),
                  ],
                ),
                actions: [
                  new FlatButton(
                      child: Text("Close message"),
                      onPressed: () {
                        Navigator.of(context).pop();
                        globalKey.currentState.setScanning(true);
                      })
                ]);
          });
    }
  }

  @override
  void dispose() {
    super.dispose();
  }
}
