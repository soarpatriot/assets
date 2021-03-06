# config valid only for current version of Capistrano
lock '3.3.5'

set :application, 'assets'
set :repo_url, 'git@github.com:soarpatriot/assets.git'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, '/var/www/my_app_name'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true
set :ssh_options, { :forward_agent => true }
set :pty, true
# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/process.yml', 'config/app.json')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('bin', 
   'log','logs','tmp/pids', 'static/upload','node_modules')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

set :deploy_to, "/data/www/assets"
set :commands, "cd #{fetch(:deploy_to)}/current && npm install && pm2 start  #{fetch(:deploy_to)}/shared/config/process.yml --no-daemon"
namespace :deploy do
  after :publishing, :upload do
    invoke "docker:upload_compose"
    invoke "docker:upload_dockerfile"
  end
  task :build do 
    on roles(:all), in: :sequence do
      within current_path  do
				execute :"docker", "container prune -f"
				execute :"docker-compose", "down"
				execute :"docker-compose", "up -d"
      end
    end
  end
  task :restart  do
    invoke :"deploy:stop"
    invoke :"deploy:start"
  end

  task :start  do
    on roles(:web)  do
      within current_path do
      end
    end
  end

  task :stop  do
    on roles(:web)  do
      within current_path do
      end
    end
  end

  after :finished, :build
end
# after :published, :upload
after "deploy:publishing", "deploy:restart"
