import http from 'http';
import initializeSocket from './utils/socket.js';
import app from './app.js';
import connectToDatabase from './config/dbconfig.js';


const startServer = async () => {
  try {
    await connectToDatabase();
    
    const port = process.env.PORT || 7000;
    // const server = app.listen(port, () => {
    //   console.log(`App is listening on port ${port}`);
    // });
    const server = http.createServer(app); // Create HTTP server
    initializeSocket(server);

    server.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
    
    process.on('unhandledRejection', (err) => {
      console.error(err);
 
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(error);
 
    process.exit(1);
  }
};

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

startServer();
