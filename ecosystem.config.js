module.exports = {
  apps: [
    {
      name: 'ESCOMONITOR_BACKEND',
      script: './webdriver-server/dist/src/server.js',
      instances: 1,
      max_memory_restart: '8096M',
      // Logging
      out_file: './out_backend.log',
      error_file: './error_backend.log',
      merge_logs: true,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',
      // Env Specific Config
      env_production: {
        NODE_ENV: 'production',
        PORT: 3033,
        exec_mode: 'fork_mode',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3003,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          './node_modules',
          './app/views',
          './public',
          './.DS_Store',
          './package.json',
          './yarn.lock',
          './samples',
          './src'
        ],
      },
    },
    {
      name: 'ESCOMONITOR_FRONTEND',
      script: './frontend/node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      max_memory_restart: '2048M',
      // Logging
      out_file: './out_frontend.log',
      error_file: './error_frontend.log',
      merge_logs: true,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',
      // Env Specific Config
      env_production: {
        NODE_ENV: 'production',
        PORT: 3034,
        exec_mode: 'fork_mode',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3004,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          './node_modules',
          './app/views',
          './public',
          './.DS_Store',
          './package.json',
          './yarn.lock',
          './samples',
          './src'
        ],
      },
    },
  ],
};