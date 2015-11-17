#node,bower,git
which git || apt-get -y install git-core
which wget || apt-get -y install wget
which nave || (

    echo " "
    echo "***********************"
    echo "*    install nave     *"
    echo "*   node environment  *"
    echo "***********************"
    echo " "

    curl -L https://raw.github.com/isaacs/nave/master/nave.sh > /usr/bin/nave
    chmod +x /usr/bin/nave
    chown -R vagrant:vagrant /home/vagrant/.nave
    chown -R vagrant:vagrant /home/vagrant/.npm
    chown -R vagrant:vagrant /home/vagrant/project
)
echo " "
echo "***********************"
echo "*   usemain 0.12.5   *"
echo "***********************"
echo " "
node -v | grep 0.12.5 || nave usemain 0.12.5
#which node || apt-add-repository ppa:chris-lea/node.js
#which node || apt-add update
which node || apt-get -y install nodejs
which node || apt-get -y install nodejs-legacy
which npm || apt-get -y install npm
#npm i -g npm
echo " "
echo "***********************"
echo "*   install node-gyp  *"
echo "* build-essential g++ *"
echo "***********************"
echo " "
which node-gyp || apt-get update
which node-gyp || rm -rf ~/tmp
which node-gyp || apt-get -y install libkrb5-dev build-essential g++ node-gyp
echo " "
echo "***********************"
echo "*    install global   *"
echo "*   dev dependancies  *"
echo "***********************"
echo " "
which gulp || npm i -g gulp 
which bower || npm i -g bower
which forever || npm i -g forever
which babel || npm i -g babel
which eslint || npm i -g eslint babel-eslint eslint-loader
apt-get -y install libfontconfig
which phantomjs || npm i -g phantomjs
which casperjs || npm i -g casperjs@1.1.0-beta3
which node-debug || npm i -g node-inspector

if [ ! -f /etc/init.d/mongod ]; then

echo " "
echo "************************"
echo "*    install mongodb   *"
echo "*   dev dependancies   *"
echo "************************"
echo " "

apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list
apt-get update
apt-get install -y --force-yes mongodb-org
apt-get install -y --force-yes mongodb-org=3.0.7 mongodb-org-server=3.0.7 mongodb-org-shell=3.0.7 mongodb-org-mongos=3.0.7 mongodb-org-tools=3.0.7

fi

service mongod stop
service mongod start


chmod +x /home/vagrant/project/build.sh
chmod +x /home/vagrant/project/install.sh
