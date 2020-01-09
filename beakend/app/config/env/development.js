const path = require('path'),
      rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  root: rootPath,
  app: {
    name: 'testApp'
  },
  port: process.env.PORT || 3001,
  WSport: process.env.WS || 6761,
  db: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'testApp'
  },
  jwtSecret: process.env.JWTSECRET || "secret",
  email: {
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      user: "ydm101194@yahoo.com",
      message: "Hello from testApp",
      subject: "testApp",
      pass: "adn45hrf"
  },
  site: {
    sidDomain: "localhost",
    domain: 'localhost:3000'
  }
};
