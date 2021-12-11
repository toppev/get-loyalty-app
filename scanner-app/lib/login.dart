import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'error_dialog.dart';
import 'scanner_page.dart';
import 'services/user_service.dart';

class LoginPage extends StatefulWidget {
  LoginPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  State<StatefulWidget> createState() => new _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailFilter = new TextEditingController();
  final TextEditingController _passwordFilter = new TextEditingController();
  String _email = "";
  String _password = "";
  bool buttonDisabled = false;

  _LoginPageState() {
    _emailFilter.addListener(_emailListen);
    _passwordFilter.addListener(_passwordListen);
  }

  void _emailListen() {
    _email = _emailFilter.text.isEmpty ? "" : _emailFilter.text;
  }

  void _passwordListen() {
    _password = _passwordFilter.text.isEmpty ? "" : _passwordFilter.text;
  }

  @override
  void initState() {
    super.initState();
    Timer.run(() => attemptAutoLogin());
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: _buildBar(context),
      body: new Container(
        margin: EdgeInsets.fromLTRB(0, 32, 0, 0),
        padding: EdgeInsets.all(16),
        child: new Column(
          children: <Widget>[
            _buildTextFields(),
            _buildButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildBar(BuildContext context) {
    return new AppBar(
      title: Text(widget.title),
      centerTitle: true,
    );
  }

  Widget _buildTextFields() {
    final size = MediaQuery.of(context).size;

    final paddingLR = size.width > 480 ? size.width * 0.25 : size.width * 0.1;
    final paddingTop = size.height * 0.25;

    return new Container(
      child: Padding(
        padding: new EdgeInsets.fromLTRB(paddingLR, paddingTop, paddingLR, 75),
        child: new Column(
          children: <Widget>[
            new Container(
              child: new TextField(
                keyboardType: TextInputType.emailAddress,
                autofillHints: [AutofillHints.email],
                controller: _emailFilter,
                decoration: new InputDecoration(labelText: 'Email'),
              ),
            ),
            new Container(
              child: new TextField(
                autofillHints: [AutofillHints.password],
                controller: _passwordFilter,
                decoration: new InputDecoration(labelText: 'Password'),
                obscureText: true,
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildButtons() {
    var userService = Provider.of<UserService>(context);
    return new Container(
      child: new Column(
        children: <Widget>[
          new RaisedButton(
            child: new Text(buttonDisabled ? 'Logging in...' : 'Login'),
            color: Colors.greenAccent,
            onPressed: buttonDisabled
                ? null
                : () async {
                    setState(() => buttonDisabled = true);
                    try {
                      await userService.login(UserCredentials(_email.trim(), _password));
                      setState(() {
                        _email = "";
                        _password = "";
                      });
                      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (context) => ScannerPage()));
                    } catch (e, stacktrace) {
                      showError(
                        context,
                        message: 'Failed to login. Check credentials and network connection (' + e.toString() + ')',
                        error: stacktrace.toString(),
                      );
                    } finally {
                      setState(() => buttonDisabled = false);
                    }
                  },
          ),
        ],
      ),
    );
  }


  /// Tries to login using cookies. Redirects if logged in successfully
  void attemptAutoLogin() {
    var userService = Provider.of<UserService>(context, listen: false);
    userService.profile().then((success) {
      if (success != null && success != false) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => ScannerPage()),
        );
      }
    }).catchError((e) => print(e));
  }
}
