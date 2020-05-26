import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';

import 'login.dart';
import 'services/scanService.dart';
import 'services/userService.dart';

void main() {
  runApp(
    MultiProvider(providers: [
      Provider(create: (context) => UserService()),
      Provider(create: (context) => ScanService()),
    ], child: MaterialApp(home: LoginPage(title: 'Scanner App - Login',))),
  );
}
