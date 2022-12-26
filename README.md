# instaclone-clone

In the case of the frontend server to create my own sns, the code was imported from github [click here](https://github.com/manikandanraji/instaclone-frontend), and the backend server was implemented and completed by myself.

There are no functions such as post modification, friend tag, and notification in the existing frontend code, so the frontend part of that part is added, and most of the functions used by Instagram are supported.

## Management

For easy testing in the development environment, Docker-compose was used, and deployment environment like minikube and AWS was managed using kubernetes.
Github actions is used for test, build, and deploy, and argoCD plays a role in detecting changes through image tags and deploying them to the cluster.
