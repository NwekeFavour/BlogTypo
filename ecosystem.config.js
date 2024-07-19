module.exports = {
  apps: [
    {
      name: "my-app",
      script: "./app.js",
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster", // Enable cluster mode
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
