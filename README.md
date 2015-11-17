# livecoding-js

Write a simple expenses tracker web application

## features
* webpack/gulp
* swagger-tools
* eslint

## configs

### server port
process.env.port or in server.js

### db
project\nodeapp\knexfile.js

```bash
cd project
npm run db
```
## setup
NODE_ENV to development or production

```bash
cd project
gulp
```
then
```bash
forever nodeapp/server.js
```
or
```bash
npm start
```
## dev
environment watch environment\Vagrantfile
buld system gulp watch project\gulpfile.js

for setup dev environment just
```bash
cd environment
.\environment\vagrant up
```
then ssh to localhost:2222 (vagrant@vagrant) and run
```bash
gulp dev
```
or
```bash
npm start
```
or
```bash
npm test
```
and etc.

you can change or import private key after vagrant up there:
```bash
environment\.vagrant\machines\default\virtualbox\
```
## web app
by default:
```bash
http://localhost:3000/
```
ui test accessed in gulp dev:
```bash
http://localhost:3000/test/
```
casper test avalible:
```bash
cd project
casperjs test test/index.js
```
or
```bash
cd project
npm test
```
## install
```bash
cd project
npm run installAll
```
## architecture
![project architecture](/docs/architecture.png "architecture of project")

## description
![project description](/docs/description.png "description of project")

### Window$ Dev

1. install [cygwin64](https://cygwin.com/setup-x86.exe) with rsync
(for work with vagrant move to step 7.)
1. set current Visual Studio version/ In my case 2015
   npm config set msvs_version 2015 --global
1. enable SeCreateSymbolicLinkPrivilege in secpol.msc
1. install [gem](http://rubyinstaller.org/downloads/)
1. install cert for [updates](https://gist.github.com/fnichol/867550)
   ruby "gist\win_fetch_cacerts.rb"
1. install [nodejs](http://nodejs.org/download/)
(with vagrant)
1. install [vagrant](https://www.vagrantup.com/downloads.html)
1. install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
1. cd environment && vagrant up
1. vagrant rsync-auto

### *nix Dev

1. install rsync (sudo apt-get install rsync)
1. install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
1. install from site [vagrant](https://www.vagrantup.com/downloads.html)
1. cd environment && vagrant up
1. then vagrant ssh
1. cd project
1. for dev: gulp dev
1. for test: npm start
1. for production: forever nodeapp/server.js or npm start

### Deploy

1. Server Ubuntu 14.04.2 64
1. install nodejs 0.10.35
1. install npm 2.7.4
1. rsync or git apt-get -y install git-core and clone repo
1. npm install -g gulp
1. npm install -g knex
1. npm install -g forever
1. npm install -g bower
1. npm install -g babel
1. postgresql-9.3
1. npm run installAll
1. project/nodeapp/knex-migrate-latest.sh
1. gulp or move dist folder
1. npm start or forever nodeapp/server.js