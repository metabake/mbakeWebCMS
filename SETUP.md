## How to setup and use meta:

You can choose a commercial vendor to setup and co-host your Meta admin/build environments, or just use the open-source version.

To install the open source version ollow these videos or the instructions below.

Part 1: https://youtube.com/watch?v=QkKb4Eyf55Q

Part 2: http://youtube.com/watch?v=pJQQZRYGPMo


1. Connect Codeanywhere (or similar WebIDE) to your third-party statically hosted web site via FTP (e.g: CDN77 Storage), Amazon S3 or WebDav.

	> If using CDN77 with FTP, get the FTP connection info (host, username and password) under CDN - CDN-Storages by clicking on the CDN STORAGE LABEL.

	> To connect Codeanywhere to your site via FTP, go to File-New Connection-FTP. Enter your FTP host, username and password. Give this connection a name (e.g. 'prod1'). Once the connection is established, you can edit Pug and other files from within Codeanywhere, without a local IDE.


1. Provision a Docker host (at 512MB Ubuntu machine is enough to get started) and setup a Web IDE. Digital Ocean has an available Ubuntu Docker 'Droplet', but you can use others. We find that the Web IDE Codeanywhere also helps with provisioning.

	> To provision a Docker host with Codeanywhere and Digital Ocean, go to  <a href='https://codeanywhere.com' target='_blank'>Code Anywhere</a> and sign up for free. Validate your account from the email you will receive (important). In the Editor, select "File-New Connection-DigitalOcean" and copy the $10 coupon code if available. Then go to <a href='https://www.digitalocean.com' target='_blank'>Digital Ocean</a>, create an account, and apply the coupon on the "Billing" page if available. Do not create a droplet at Digital Ocean. In Codeanywhere, go to File-New Connection-Digital Ocean. Select a 512MB machine at the location nearest to you. From the list of images, choose `Docker... on 16.04`. As hostname, enter `dockermeta1` or another hostname of your choice. Ensure that "Codeanywhere SSH Key" is checked, then click 'Create'. You will be prompted for your Digital Ocean credentials. Allow the installation to complete.

2. SSH to the provisioned machine and create a folder as primary store for persistent local data with e.g. `mkdir dev1`, so the admin app and potentially some project code remains available across docker image updates. (We will make that folder accessible to the docker image in step 3).

	> To do this in Codeanywhere, rightclick on the created connection ('dockermeta1') to open an SSH Terminal. On the command line, enter `mkdir dev1`.

3. Once Docker is installed on a host, download and run a working Docker image for nbake admin. You should be able to cut and paste into SSH:

        // download the Meta container image
        docker pull nbake/meta:latest

        // start that app container with ports 8080 for IDE and 8081 for admin and access to /dev1
        docker run -d --privileged -p 20-21:20-21 -p 8080-8082:8080-8082 nbake/meta /sbin/my_init

        // get the container CONTAINER_ID (e.g. b6fbd9d948eb)
        docker ps

        // enter the container via the CONTAINER_ID
        docker exec -ti CONTAINER_ID /bin/bash

        // (optionally) list the files in the container
        ls -la

	With this docker image you have a container with a cloud development environment where you can run node and other utils, for a bespoke Meta admin|build or other services that you can't run purely client side.

4. Install the admin app. Inside the Docker image:

        // go to the persistent directory
        cd /home/admin/dev1

        // install nbake
        npm -g i nbake

        // extract the sample admin app
        nbake -a

        // install the sample admin app (to run as node app)
        npm i

	We will later edit `admin.yaml` in this folder, but we first need to connect to something we can admin/build.

6. Setup build server access to your third-party hosted web site. To mount it via FTP, in the Docker console:

        // make a directory where you will mount
        mkdir /home/admin/mnt

        // use the FTP user name and address of your static site
        // if you wish to use S3, follow the instructions at /PERSPECTIVES/S3.md
        sshfs -o allow_other USERNAME@HOST_IP:/www/ /home/admin/prod1
        // omit /www/ if your site is at the root of the FTP folder

        // (optionally) list your web app files
        ls /home/admin/mnt

        cd /home/admin/dev1
        // edit admin.yaml. It needs a password and where to mount.
         // ensure mount is set to /home/admin/mnt and srv_www to /home/admin/dev1/www_admin/
        nano admin.yaml

        //start the admin app
        node start index.js . // you will see the admin app log in the console
        // or:
        pm2 start index.js -- . // you won't see the console


7. In your browser, the admin app should now be available at http://YOUR_HOST_IP:8081

	> If using Digital Ocean, YOUR_HOST_IP is the Droplet IP address. You can find it in the list of Droplets in your Digital Ocean account.

	You can trigger a build of the mounted app with http://YOUR_HOST_IP:8081/api/bake?secret=123&folder=/


You can mount several remote webapps in a folder. And then have admin.yaml point to that folder.


If you wish to use a local IDE instead of a Web IDE, see the instructions at https://github.com/metabake/meta/blob/master/ALT.md