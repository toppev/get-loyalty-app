import 'package:flutter/material.dart';
import 'errorDialog.dart';
import 'package:provider/provider.dart';

import 'scannerPage.dart';
import 'services/userService.dart';

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
    return new Container(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(120, 270, 120, 90),
        child: new Column(
          children: <Widget>[
            new Container(
              child: new TextField(
                controller: _emailFilter,
                decoration: new InputDecoration(labelText: 'Email'),
              ),
            ),
            new Container(
              child: new TextField(
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
            child: new Text('Login'),
            color: Colors.greenAccent,
            onPressed: () {
              userService
                  .login(UserCredentials(_email, _password))
                  .then((value) {
                // TODO handle login
                Navigator.of(context).push(
                    MaterialPageRoute(builder: (context) => ScannerPage()));
              }).catchError((e) {
                showError(context,
                    message:
                        'Could not login. Check credentials and network connection',
                    error: e.toString());
              });
            },
          ),
        ],
      ),
    );
  }
}
