# aws-cloud-control-sample-app
Sample application harnessing the new AWS Cloud Control API and App Runner service. For illustration purposes only!

Uses <a href="https://vitejs.dev/">vite</a> and
    <a href="https://reactjs.org/">React</a>, and intended to be built by App
    Runner. Functionally, it uses Musicbrainz API to find info and links for any
    musical artist known in its databases.

## Required for App Runner config:

`runtime`
```
nodejs12
```

`port`
```
5000
```

`build_command`(s)
```
npm install
npm run build
```

`run`
```
npm run serve
```

## How to provision and deploy (Terraform)

## Prerequisites

* Install Terraform - https://releases.hashicorp.com/terraform/0.15.2/terraform_0.15.2_darwin_amd64.zip
* Configure your AWS credentials (aws_access_key_id, aws_secret_access_key) on your local machine and update the aws profile name accordingly in the terraform.tfvars file

## How to deploy

1. Duplicate the example environment folder (environment-example) and name it accordingly for new the application.

2. Update variables configured in ```terraform.tfvars``` and ```terraform_backend.tf``` to ensure variables are correct for your new application

3. Run the following commands, replacing ```[environment-folder-name]``` accordingly:

```
cd infrastructure/
bash bin/deploy_infra.sh [environment-folder-name] plan
```

Assuming the plan outlined on screen reflects changes that need to be made, you can now create apply those changes by running

```
bash bin/deploy_infra.sh [environment-folder-name] create
```

## How to remove

1. Run the following commands, replacing ```[environment-folder-name]``` accordingly:

```
cd infrastructure/
bash bin/deploy_infra.sh [environment-folder-name] destroy
```