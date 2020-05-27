import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';

import 'login.dart';
import 'services/scan_service.dart';
import 'services/session_service.dart';
import 'services/user_service.dart';

void main() {
  runApp(
    MultiProvider(
        providers: [
          Provider(create: (context) => SessionService()),
          Provider(
              create: (context) => UserService(
                  Provider.of<SessionService>(context, listen: false))),
          Provider(
              create: (context) => ScanService(
                  Provider.of<SessionService>(context, listen: false))),
        ],
        child: MaterialApp(
            // TODO login automatically?
            home: LoginPage(
          title: 'Scanner App - Login',
        ))),
  );
}
