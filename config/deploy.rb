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

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/process.yml')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('bin', 
   'log', 'tmp/pids', 'upload','node_modules')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :deploy do
  task :restart  do
    invoke :"deploy:stop"
    invoke :"deploy:start"
  end

  task :start  do
    on roles(:web)  do
      within current_path do
        unless test("[ -f #{fetch(:app_pid)} ]")
          info ">>>>> start"
          execute "pm2 start #{current_path}/config/process.yml"
        else 
          error ">>>>>> already started"
        end 

      end
    end
  end

  task :stop  do
    on roles(:web)  do
      within current_path do
        if test("[ -f #{fetch(:app_pid)} ]")
          info ">>>>> stop"
          execute :pm2, 'stop assets'
        end 
      end
    end
  end

end
after "deploy:publishing", "deploy:restart"
