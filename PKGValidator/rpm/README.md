# PUMBA rpm package validator
## Intro
This micro-service tests the validity of rpm packages by downloading them and trying to install them. If the package is corrupt or is missing dependencies or for any other reason it failed to install the package, the package will not be sent to the PKG uploader.

## Architecture
The code is split into 3 files; index, functions & genericfunctions.
index - Starting point of the application, calls functions from the other files.
functions - functions specific to validation of RPM packages.
genericfunctions - functions that are generic for package validation that can be used for other package validation tools of pumba.

## Testing
In the test directory there is a directory with a light weight rpm package that does not require dependencies for testing and testing file for the different kind of tests. GenericTesting is a file to test the generic functions which as explained previously can be used for other package validation tools of pumba.

## CI
We are using Tekton as our CI tool. In the tekton directory is the YAML files for the pipeline run with resources for the RPM package validator.
The CI will also have a generic pipeline for the pumba validation tools where each tool will have a pipeline run and pipeline image resource declaring variables for each tool.