namespace :docker do 
  task :upload_dockerfile do 
    on roles :web do
      dest = "#{current_path}/docker/Dockerfile"
      upload! from_template("Dockerfile.erb"), dest
      info "Uploaded to '#{fetch(:server_name)}@#{dest}'"
    end
  end
  task :upload_compose do 
    on roles :web do
      dest = "#{current_path}/docker-compose.yml"
      upload! from_template("docker-compose.yml.erb"), dest
      info "Uploaded to '#{fetch(:server_name)}@#{dest}'"
    end
  end

end
