echo 
echo "******************************"
echo "*   install dependancies     *"
echo "******************************"
echo 
cd /home/vagrant/project/
./install.sh 
echo 
echo "******************************"
echo "*     gulp && npm tests      *"
echo "******************************"
echo 
./build.sh
#gulp serve
