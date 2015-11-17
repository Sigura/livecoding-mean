vagrant up 
echo npm install 
ssh -f -o "StrictHostKeyChecking no" -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "cd /home/vagrant/project/ && npm install && ls" 
echo knex migrate latest 
ssh -f -o "StrictHostKeyChecking no" -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "cd /home/vagrant/project/nodeapp && knex migrate:latest && ls" 
echo gulp serve 
ssh -f -o "StrictHostKeyChecking no" -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@127.0.0.1 "cd /home/vagrant/project && gulp && gulp serve && ls" 
sleep 5s 
vagrant rsync-auto 
