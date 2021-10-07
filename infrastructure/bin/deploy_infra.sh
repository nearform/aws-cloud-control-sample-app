#!/bin/bash
set -e
DEPLOYMENT_ENV=$1
ACTION=$2
DIR="$(pwd)"

function terraform_prepare {
    cd  "${DIR}/provision/terraform/aws"
    rm -fR .terraform
    ln -sf "${DIR}/environment/$DEPLOYMENT_ENV/terraform_backend.tf"  "./terraform_backend.tf"
    terraform get -update
    terraform init
}

function show_usage {
    echo "Error. Usage: bash bin/deploy_infra.sh [environment] [plan|create|autocreate|destroy]"
}

function execute {
    DIR="$(pwd)"
    echo "current directory: ${DIR}"
    if [ "$ACTION" == "create" ]
    then
        terraform_prepare
        terraform apply -var-file "${DIR}/environment/$DEPLOYMENT_ENV/terraform.tfvars"

    elif [ "$ACTION" == "autocreate" ]
    then
        terraform_prepare
        terraform apply --auto-approve "${DEPLOYMENT_ENV}"_terraform.plan

    elif [ "$ACTION" == "plan" ]
    then
        terraform_prepare
        terraform plan -var-file "${DIR}/environment/$DEPLOYMENT_ENV/terraform.tfvars" -out="${DEPLOYMENT_ENV}"_terraform.plan

    elif [ "$ACTION" == "destroy" ]
    then
        terraform_prepare
        terraform destroy -var-file "${DIR}/environment/$DEPLOYMENT_ENV/terraform.tfvars"

    else
        show_usage
    fi
}

if [ "$#" -ne 2 ]; then
    echo "Parameters $#"
    show_usage
    exit 1
fi

execute $DEPLOYMENT_ENV $ACTION
