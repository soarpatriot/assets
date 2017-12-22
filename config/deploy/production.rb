set :stage, :production

set :profile, "production"

set :deploy_to, "/data/www/assets"

set :app_pid, "#{shared_path}/tmp/pids/application-0.pid"

set :server_name, "www.sanweiyun.com"

set :branch, "master"

set :default_env, {
  'NODE_ENV' => 'production'
}

server fetch(:server_name), user: 'soar', roles: %w{web app}

