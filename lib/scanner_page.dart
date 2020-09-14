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
                  onScan: _onScan,
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
                        margin: EdgeInsets.all(48.0),
                        child: RaisedButton(
                          onPressed: () {
                            var newState = !isScanning;
                            setState(() => isScanning = newState);
                            globalKey.currentState.setScanning(newState);
                            print('Camera state changed: $newState');
                          },
                          color: isScanning ? Colors.redAccent : Colors.green,
                          child: Text(isScanning ? SCANNING : PAUSED),
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

  void _onScan(GetScan data) {
    var scanService = Provider.of<ScanService>(context, listen: false);
    print('Scan get result: $data');
    showDialog(
      context: context,
      builder: (BuildContext context) => QuestionDialogWidget(
          onSubmit: (res) {
            scanService.useScan(data.scannedString, res).then((result) {
              print('Scan used. Response: ${result.toJson()}');
              Navigator.of(context).pop();
              _onScanSubmitted(result);
            }).catchError((e) {
              print(e);
              showError(context, message: "Please check connection", error: e.toString());
            });
          },
          questions: data.questions,
          data: data.toJson()),
    );
  }

  _onScanSubmitted(UseScan result) {
    // If true, the customer did not scan a reward (and did not use one)
    // Nothing to open so start scanning again
    if (result.usedReward == null) {
      globalKey.currentState.setScanning(true, startCooldown: true);
    } else {
      var reward = result.usedReward;
      showDialog(
          context: context,
          builder: (BuildContext context) {
            var height = MediaQuery.of(context).size.height;
            var width = MediaQuery.of(context).size.width;

            return AlertDialog(
                title: Text(
                  "Customer used reward: ${reward['name']}",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 24, color: Colors.black54),
                ),
                shape:
                    RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
                content: DefaultTextStyle(
                  style: TextStyle(fontSize: 28, color: Colors.black87),
                  child: Container(
                    width: width * 0.7,
                    height: height * 0.5,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 24.0),
                      child: Column(
                        children: <Widget>[
                          Text("Name: ${reward['name']}"),
                          Text("Discount: ${reward['description']}"),
                          Text(reward['requirement'] != null
                              ? "Note: ${reward['requirement']}"
                              : ""),
                          Text(reward['description']),
                        ],
                      ),
                    ),
                  ),
                ),
                actions: [
                  new FlatButton(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          "Close message",
                          style: TextStyle(fontSize: 30),
                        ),
                      ),
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
