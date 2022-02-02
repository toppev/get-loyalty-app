import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'question_dialog.dart';
import 'scanner.dart';
import '../util/error_dialog.dart';
import '../menu.dart';
import '../services/scan_service.dart';

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

  ScanService scanService;

  @override
  Widget build(BuildContext context) {
    scanService = Provider.of<ScanService>(context);
    return Scaffold(
      appBar: new AppBar(
        title: new Text('Scanner'),
        actions: <Widget>[MenuWidget()],
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 1,
            child: Transform.scale(
                scale: 0.8,
                child: ScannerWidget(
                  key: globalKey,
                  onScan: _onScan,
                  onScanToggle: _updateToggleButton,
                )),
          ),
          Expanded(
            flex: 1,
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
                        child: ElevatedButton(
                          onPressed: () {
                            var newState = globalKey.currentState.setScanning(!isScanning);
                            setState(() => isScanning = newState);
                            print('Camera state changed: $newState');
                          },
                          style: ElevatedButton.styleFrom(
                            primary: isScanning ? Colors.redAccent : Colors.green,
                          ),
                          child: Text(isScanning ? SCANNING : PAUSED),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
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
              _onScanSubmitted(result, data);
            }).catchError((e) {
              print(e);
              showError(context, message: "Please check connection", error: e.toString());
            });
          },
          questions: data.questions,
          data: data.toJson()),
    );
  }

  // TODO: clean up to separate parts
  _onScanSubmitted(UseScan result, GetScan scannedData) {
    // If null, the customer did not scan a reward (and did not use one)
    // Nothing to open so start scanning again
    if (result.usedReward != null) {
      var reward = result.usedReward;
      showDialog(
          context: context,
          builder: (BuildContext context) {
            final height = MediaQuery.of(context).size.height;
            final width = MediaQuery.of(context).size.width;

            return AlertDialog(
                title: Text(
                  "The customer wants to use reward: ${reward['name']}",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 24, color: Colors.black54),
                ),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
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
                          Text(reward['requirement'] != null ? "Note: ${reward['requirement']}" : ""),
                          Text(reward['description']),
                        ],
                      ),
                    ),
                  ),
                ),
                actions: [
                  new TextButton(
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
    if (result.newRewards.isNotEmpty) {
      // Open a dialog for each
      result.newRewards.forEach((reward) {
        showDialog(
            context: context,
            builder: (BuildContext context) {
              final height = MediaQuery.of(context).size.height;
              final width = MediaQuery.of(context).size.width;

              return AlertDialog(
                  title: Text(
                    "Customer got a new reward: ${reward['name']}",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 24, color: Colors.black54),
                  ),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
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
                            Text(reward['requirement'] != null ? "Note: ${reward['requirement']}" : ""),
                            Text(reward['description']),
                          ],
                        ),
                      ),
                    ),
                  ),
                  actions: [
                    new TextButton(
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            "Do Not Use",
                            style: TextStyle(fontSize: 30, color: Colors.red),
                          ),
                        ),
                        onPressed: () {
                          Navigator.of(context).pop();
                          globalKey.currentState.setScanning(true);
                        }),
                    new TextButton(
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            "Use Reward Now",
                            style: TextStyle(fontSize: 30, color: Colors.green),
                          ),
                        ),
                        onPressed: () {
                          // TODO: test this
                          // Works with "recursion", as if we scanned this id
                          final scanData = "${scannedData.user['id']}:${reward['id']}"; // TODO: get this somehow
                          scanService.getScan(scanData).then((result) {
                            Navigator.of(context).pop();
                            print('Handling request result: ${result.toJson()}');
                            _onScan(result);
                          }).catchError((e) {
                            Navigator.of(context).pop();
                            print(e);
                            showError(context, message: "Please check connection", error: e.toString());
                          });
                        })
                  ]);
            });
      });
    } else {
      globalKey.currentState.setScanning(true, startCooldown: true);
    }
  }

  @override
  void dispose() {
    super.dispose();
  }
}
