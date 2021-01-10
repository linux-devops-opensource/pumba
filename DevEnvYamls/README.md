# Development environment
Here are the yamls and charts needed to set up a dev environment to do tests on. This is made up of making a new namespace for PUMBA, deploying tekton pipelines & deploying sonatype nexus3 with helm

The Nexus helm chart was downloaded from: https://artifacthub.io/packages/helm/sonatype/nexus-repository-manager (Edited by enabling ingress)

The Tekton-pipelines YAML was downloaded from: https://github.com/tektoncd/pipeline/blob/master/docs/install.md

# Deploying env
kubectl apply -f ./
helm install -n pumba nexus3-oss ./nexus_chart